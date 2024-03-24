import { styled } from "styled-components";
import { DarkBanner } from "../components/banner/Banner";
import DateSelector from "../components/DateSelector";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { CopyRight } from "./Home";
import { lazy, useState } from "react";
import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleEnroll } from "../counterSlice";
import { greenColor } from "../color";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import useUser from "../useUser";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";
import LocationForm from "../components/form/LocationForm";
const MatchForm = lazy(() => import("../components/form/MatchForm"));
const logo4 = require("../img/4.jpg");

const SEARCH_MATCHES_MUTATION = gql`
  query SearchMatches(
    $isInside: Boolean
    $searchMatchesId: Int
    $date: String
    $isSingle: Boolean
    $storeName: String
  ) {
    searchMatches(
      isInside: $isInside
      id: $searchMatchesId
      date: $date
      isSingle: $isSingle
      storeName: $storeName
    ) {
      id
      title
      startTime
      endTime
      isSingle
      isInside
      storeName
      user {
        id
        username
      }
      users {
        userId
      }
    }
  }
`;

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Content = styled.div`
  width: 950px;
  margin-bottom: 150px;
`;

const SelectsBox = styled.div`
  display: flex;
  justify-content: center;
`;

const Select = styled.select`
  width: 110px;
  height: 30px;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-right: 10px;
`;

const EnrollButton = styled.div`
  width: 100px;
  height: 45px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${greenColor};
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
`;

const MatchBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  div {
    display: flex;
    height: 100%;
    &:first-child {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
    }
    &:nth-child(2) {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: 20px;
      span {
        &:first-child {
          font-size: 16px;
          margin-bottom: 8px;
        }
        &:last-child {
          font-size: 14px;
        }
      }
    }
    &:nth-child(3) {
      width: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        &:first-child {
          font-size: 16px;
          margin-bottom: 10px;
        }
        &:last-child {
          font-size: 12px;
        }
      }
    }
    &:last-child {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      div {
        margin-right: 15px;
        width: 90px;
        height: 42px;
        border-radius: 21px;
        background-color: ${greenColor};
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
`;

const Match = () => {
  const { date } = useParams();
  const { data: myData } = useUser();
  const enroll = useSelector((state: RootState) => state.counter.isEnroll);

  const isLocation = useSelector(
    (state: RootState) => state.counter.isLocation
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const locationList = ["전체", "서울중심", "서울테니스", "서울테니스클럽"];
  const typeList = ["전체", "단식", "복식"];
  const sideList = ["전체", "실내", "야외"];

  const [storeName, setStoreName] = useState("전체");
  const [isSingle, setIsSingle] = useState("전체");
  const [isInside, setIsInside] = useState("전체");

  const onLocationChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setStoreName(value);
  };

  const onTypeChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setIsSingle(value);
  };

  const onSideChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setIsInside(value);
  };

  const year = date?.substring(0, 4);
  const month = date?.substring(4, 6);
  const number = date?.substring(6, 8);
  const dateString = `${year}-${month}-${number}`;

  const { data } = useQuery(SEARCH_MATCHES_MUTATION, {
    variables: {
      date: dateString,
    },
  });

  return (
    <>
      {data ? (
        <>
          <Helmet>
            <title>Match</title>
            <meta property="og:site_name" content="tennis" />
            <meta property="og:title" content="match" />
            <meta
              property="og:url"
              content="https://tennis-frontend-plum.vercel.app/"
            />
            <meta
              property="og:description"
              content="tennis web for portfolio"
            />
          </Helmet>
          <Container>
            <DarkBanner url={logo4}>
              <span>Matching</span>
              <span>Check out the Matching schedule!</span>
            </DarkBanner>
            <DateSelector dateString={`${number}`} />
            <Content>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "70px",
                  borderBottom: " 1px solid black",
                }}
              >
                <SelectsBox>
                  <Select onChange={onLocationChange}>
                    {locationList.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                  <Select onChange={onTypeChange}>
                    {typeList.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                  <Select onChange={onSideChange}>
                    {sideList.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </SelectsBox>
                {myData ? (
                  <EnrollButton onClick={() => dispatch(toggleEnroll())}>
                    매치등록
                  </EnrollButton>
                ) : null}
              </div>
              {data.searchMatches
                .filter(
                  (v: any) =>
                    (storeName === "전체" || v.storeName === storeName) &&
                    (isSingle === "전체" ||
                      (isSingle === "단식"
                        ? v.isSingle === true
                        : v.isSingle === false)) &&
                    (isInside === "전체" ||
                      (isInside === "실내"
                        ? v.isInside === true
                        : v.isInside === false))
                )
                .map((value: any, index: number) => {
                  const isClosed =
                    (value.isSingle && value.users.length === 2) ||
                    (!value.isSingle && value.users.length === 4);
                  return (
                    <MatchBox
                      key={index}
                      onClick={() => navigate(`/match/${value.id}`)}
                    >
                      <div>
                        <span>
                          {value.startTime}~{value.endTime}
                        </span>
                      </div>
                      <div>
                        <span>
                          <FontAwesomeIcon
                            style={{ opacity: "0.8" }}
                            icon={faLocationDot}
                          />{" "}
                          {value.storeName}
                        </span>
                        <span>
                          {value.isInside ? "실내" : "야외"}{" "}
                          <FontAwesomeIcon
                            style={{ opacity: "0.8" }}
                            icon={faUser}
                          />{" "}
                          {value.users.length}/{value.isSingle ? "2" : "4"}
                        </span>
                      </div>
                      <div>
                        <span>테니스 매치</span>
                        <span>
                          <FontAwesomeIcon
                            style={{ opacity: "0.8" }}
                            icon={faUser}
                          />{" "}
                          {value.user.username}
                        </span>
                      </div>
                      <div>
                        <div
                          style={{
                            background: isClosed ? "#cf4c4c" : greenColor,
                          }}
                        >
                          {isClosed ? "신청마감" : "신청가능"}
                        </div>
                      </div>
                    </MatchBox>
                  );
                })}
            </Content>
            {enroll ? <MatchForm /> : null}
            {isLocation ? <LocationForm /> : null}
            <CopyRight>Copyright ⓒ jinhyukSeo777 2023</CopyRight>
          </Container>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Match;
