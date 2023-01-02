import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

import "./searchAnimation.css";

const SearchAnimation = () => {
  const [showSearchInput, setShowSearchInput] = useState(true);

  return (
<div class="search">
    <h1>Search Bar Animation</h1>
    <div className="main_container">
      <input
        className={`${
          showSearchInput ? "show_input_field" : "hide_input_field"
        }`}
        type="text"
        placeholder="Search..."
      />
      <div
        className={`action_button ${
          !showSearchInput ? "search_icon" : "close_icon"
        }`}
        onClick={() => setShowSearchInput(!showSearchInput)}
      >
        {!showSearchInput ? <BiSearch /> : <AiOutlineClose />}
      </div>
    </div>
</div>
  );
};

export default SearchAnimation;