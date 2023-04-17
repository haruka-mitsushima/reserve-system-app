import React from "react";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userData = sessionStorage.getItem('auth') 
  const navigate = useNavigate()

  const logout = () => {
    sessionStorage.removeItem("auth");
    navigate('/login')
  };

  return (
    <header>
      <div className={styles.headerElements}>
        <Link to="/">
          <HomeIcon />
          ホーム
        </Link>
        <Link to="/reserve">
          <DriveFileRenameOutlineIcon />
          設備予約
        </Link>
        <Link to="/mypage">
          <PersonOutlineIcon />
          マイページ
        </Link>
      </div>
      {!userData ? (
        <Link to="/login" onClick={() => {}}>
          <LoginIcon />
            ログイン
        </Link>
      ): (
        <Link to="/login" onClick={() => {logout()}}>
        <LoginIcon />
          ログアウト
      </Link>
      )}

    </header>
  );
};

export default Header;
