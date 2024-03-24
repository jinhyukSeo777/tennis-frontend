import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import LoginForm from "./form/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleCreate, toggleLogin } from "../counterSlice";
import { useNavigate, useMatch } from "react-router-dom";
import { greenColor } from "../color";
import { isLoggedInVar, logUserOut } from "../apollo";
import useUser from "../useUser";
import CreateAccountForm from "./form/CreateAccountForm";
import SearchIDForm from "./form/SearchIDForm";
import SearchPWForm from "./form/SearchPWForm";

const Container = styled.div<{ scrollposition: number; isprofile: number }>`
  width: 100%;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  color: ${({ scrollposition, isprofile }) =>
    scrollposition >= 100 || isprofile ? "black" : "white"};
  background-color: ${({ scrollposition, isprofile }) =>
    scrollposition >= 100 || isprofile ? "white" : "inherits"};
  z-index: 99;
`;

const Column = styled.div`
  margin: 0 54px 0 70px;
`;

const LeftSpan = styled.span`
  font-weight: 600;
  font-size: 25px;
  cursor: pointer;
  font-family: "Times New Roman", Times, serif;
  letter-spacing: 1.5px;
`;

const RightSpan = styled.span`
  font-weight: 500;
  font-size: 16px;
  margin-left: 24px;
  cursor: pointer;
  &:nth-last-child(1),
  &:nth-last-child(2) {
    padding: 14px;
    border-radius: 6px;
    color: ${greenColor};
    &:hover {
      background-color: ${greenColor};
      color: white;
    }
  }
`;

const Header = () => {
  //Redux
  const login = useSelector((state: RootState) => state.counter.isLogin);
  const create = useSelector((state: RootState) => state.counter.isCreate);
  const searchID = useSelector((state: RootState) => state.counter.isSearchID);
  const searchPW = useSelector((state: RootState) => state.counter.isSearchPW);
  const dispatch = useDispatch();

  // header backgroundColor change
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScrollPosition = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScrollPosition);
  });

  //
  const navigate = useNavigate();
  const isProfile = useMatch("/profile/:id");

  //
  const onLoginClicked = () => dispatch(toggleLogin());
  const onCreateClicked = () => dispatch(toggleCreate());
  const onLogoutClicked = () => {
    logUserOut();
    navigate("/");
    window.location.reload();
  };

  const { data } = useUser();

  //
  const date = new Date();
  const number = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const matchUrl = `/matching/${year}${month < 10 ? "0" + month : month}${
    number < 10 ? "0" + number : number
  }`;

  return (
    <Container
      scrollposition={scrollPosition || 0}
      isprofile={isProfile ? 1 : 0}
    >
      <Column>
        <LeftSpan onClick={() => navigate("/")}>GOGOtennis</LeftSpan>
      </Column>
      <Column>
        <RightSpan onClick={() => navigate("/")}>홈</RightSpan>
        <RightSpan onClick={() => navigate(matchUrl)}>매치</RightSpan>
        {/* <RightSpan>대회</RightSpan> */}
        <RightSpan onClick={() => navigate("/ranking")}>랭킹</RightSpan>
        <RightSpan onClick={() => navigate("/community")}>커뮤니티</RightSpan>
        {/* <RightSpan onClick={() => navigate("/club")}>동호회</RightSpan> */}
        {isLoggedInVar() ? (
          <RightSpan onClick={() => navigate(`/profile/${data.myProfile?.id}`)}>
            내 정보
          </RightSpan>
        ) : (
          <RightSpan onClick={onCreateClicked}>회원가입</RightSpan>
        )}
        {isLoggedInVar() ? (
          <RightSpan onClick={onLogoutClicked}>로그아웃</RightSpan>
        ) : (
          <RightSpan onClick={onLoginClicked}>로그인</RightSpan>
        )}
      </Column>
      {login ? <LoginForm /> : null}
      {create ? <CreateAccountForm /> : null}
      {searchID ? <SearchIDForm /> : null}
      {searchPW ? <SearchPWForm /> : null}
    </Container>
  );
};

export default Header;
