import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSection from "./FilterSection";

const filterKeys = {
  category: "Category",
  subCategory: "Sub Category",
  location: "Location",
  duration: "Duration",
};

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isHidden, setIsHidden] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subCategory: true,
    location: true,
    duration: true,
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const filters = {
    location: [
      "London",
      "Paris",
      "Damascus",
      "Manchester",
      "Istanbul",
      "Amsterdam",
      "Rome",
      "Madrid",
      "Barcelona",
      "Athens",
      "Dubai",
      "Sharm El Sheikh",
    ],
    duration: ["One week", "Two weeks"],
  };

  const getCurrentFilters = () => {
    return {
      category: searchParams.get("category") || null,
      subCategory: searchParams.get("subCategory") || null,
      location: searchParams.get("city") || null,
      duration: searchParams.get("duration") || null,
    };
  };

  const selectedFilters = getCurrentFilters();

  // Update URL parameters
  const updateUrlParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    // Reset page to 1 when filters change
    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_LINK}/api/courses/main-category`)
      .then((res) => res.json())
      .then((data) => {
        const categoryNames = data.map((cat) => cat.category);
        setCategories(categoryNames);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
        setCategories([]);
      });
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const currentCategory = selectedFilters.category;

    if (!currentCategory) {
      setSubCategories([]);
      setLoadingSubCategories(false);
      return;
    }

    setLoadingSubCategories(true);
    fetch(
      `${
        import.meta.env.VITE_API_LINK
      }/api/courses/category/${encodeURIComponent(currentCategory)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const subCategoryList = data.map((item) => item.sub_category);
        setSubCategories(subCategoryList);
      })
      .catch((err) => {
        console.error("Failed to fetch subcategories", err);
        setSubCategories([]);
      })
      .finally(() => {
        setLoadingSubCategories(false);
      });
  }, [selectedFilters.category]);

  const toggleSection = useCallback((sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  const handleOptionClick = (sectionName, option) => {
    const currentValue = selectedFilters[sectionName];
    let updates = {}; // Toggle the filter (deselect if already selected)
    if (currentValue === option) {
      // Deselecting current option
      if (sectionName === "location") {
        updates.city = null;
      } else if (sectionName === "duration") {
        updates.duration = null;
      } else {
        updates[sectionName] = null;
      }
    } else {
      // Selecting new option
      if (sectionName === "location") {
        updates.city = option; // Map location to city for backend
      } else if (sectionName === "duration") {
        updates.duration = option;
      } else {
        updates[sectionName] = option;
      }
    }

    // Reset subCategory if category is changed
    if (sectionName === "category") {
      updates.subCategory = null;
    }

    updateUrlParams(updates);
  };

  const toggleFilter = useCallback(() => {
    setIsHidden((prev) => !prev);
  }, []);

  return (
    <div className="flex min-[1100px]:flex-col gap-6 max-[1100px]:mt-5">
      <h4 className="text-[18px] font-bold text-[#21272A] max-[1100px]:hidden">
        Filter by
      </h4>
      <h4
        className="text-[18px] font-bold text-[#21272A] cursor-pointer w-fit h-fit select-none min-[1100px]:hidden text-nowrap"
        onClick={toggleFilter}
      >
        {isHidden ? "Show Filters" : "Hide Filters"}{" "}
        <span>{isHidden ? "▼" : "▲"}</span>
      </h4>

      <div
        className={`max-[1100px]:${
          isHidden ? "hidden" : "visible"
        } flex min-[1100px]:flex-col [&>*]:flex-1 gap-6 max-[1100px]:justify-evenly max-[1100px]:mt-5 w-full`}
      >

        {/* Category Filter */}
        <FilterSection
          title={filterKeys.category}
          options={categories}
          isExpanded={expandedSections.category}
          toggle={() => toggleSection("category")}
          selectedOption={selectedFilters.category}
          onOptionClick={(option) => handleOptionClick("category", option)}
        />

        {/* SubCategory Filter */}
        {selectedFilters.category && (
          <FilterSection
            title={filterKeys.subCategory}
            options={subCategories}
            isExpanded={expandedSections.subCategory}
            toggle={() => toggleSection("subCategory")}
            selectedOption={selectedFilters.subCategory}
            onOptionClick={(option) => handleOptionClick("subCategory", option)}
            loading={loadingSubCategories}
          />
        )}

        {/* Location Filter */}
        <FilterSection
          title={filterKeys.location}
          options={filters.location}
          isExpanded={expandedSections.location}
          toggle={() => toggleSection("location")}
          selectedOption={selectedFilters.location}
          onOptionClick={(option) => handleOptionClick("location", option)}
        />

        {/* Duration Filter */}
        <FilterSection
          title={filterKeys.duration}
          options={filters.duration}
          isExpanded={expandedSections.duration}
          toggle={() => toggleSection("duration")}
          selectedOption={selectedFilters.duration}
          onOptionClick={(option) => handleOptionClick("duration", option)}
        />
      </div>
    </div>
  );
};

export default Filters;
