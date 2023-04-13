import React from "react";
import "../styles/Header.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/">
        <AssignmentIcon />
        ホーム
      </Link>
      <div>Home</div>
      <div>予約</div>
      <div>マイページ</div>
      <div>button</div>
    </header>
  );
};

export default Header;
