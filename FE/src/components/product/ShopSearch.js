import React, {useState} from "react";
import PropTypes from "prop-types";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import { useTranslation } from "react-i18next";

const ShopSearch = ({searchHandle}) => {
    const [searchValue, setSearchValue] = useState("");
    const handleSearch=(e)=>{
        e.preventDefault();
        searchHandle(searchValue);
    }
    const handleInputChange = (e) =>{
        setSearchValue(e.target.value);
    }
    const {t} = useTranslation(['product']);
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">{t('sidebar.search')} </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" action="#" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('sidebar.search-here')}
            onChange={handleInputChange}
          />
          <button>
            <i className="pe-7s-search" disabled />
          </button>
        </form>
      </div>
    </div>
  );
};
ShopSearch.propTypes = {
    searchHandle: PropTypes.func
};
export default ShopSearch;
