import { styled } from "styled-components";
import { LightBanner } from "../components/banner/Banner";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import LoaderComponent from "../components/Loader";
const logo1 = require("../img/1.jpg");
const logo5 = require("../img/5.jpg");
const gold = require("../img/gold.png");
const silver = require("../img/silver.png");
const iron = require("../img/iron.png");

const SEE_RANKING_MUTATION = gql`
  query seeRanking {
    seeRanking {
      id
      username
      totalWin
      totalLose
      score
      avatar
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

const RankerBoxs = styled.div`
  width: 1100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RankerBox = styled.div`
  width: 300px;
  height: 270px;
  margin: 30px;
  margin-top: 70px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.3);
  overflow: hidden;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      width: 100%;
      height: 70px;
      background-color: #757475;
      color: white;
      font-size: 30px;
      position: relative;
      img {
        position: absolute;
        top: 0px;
        left: -13px;
        width: 100px;
        height: 100px;
      }
    }
    &:last-child {
      margin-top: 25px;
    }
  }
`;

const LeftBox = styled.div<{ url: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  div {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-image: url(${({ url }) => (url ? url : logo1)});
    background-size: cover;
    background-position: center;
  }
  span {
    margin-top: 15px;
    font-size: 18px;
    font-family: "Times New Roman", Times, serif;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  span {
    margin-top: 15px;
    font-size: 20px;
  }
`;

const RankingBoxs = styled.div`
  margin-top: 60px;
  width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RankingBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
    cursor: pointer;
  }
  &:first-child {
    background-color: #e3f0e4;
  }
  span {
    text-align: center;
    &:nth-child(1) {
      width: 100px;
    }
    &:nth-child(2) {
      width: 400px;
    }
    &:nth-child(3) {
      width: 200px;
    }
    &:nth-child(4) {
      width: 200px;
    }
    &:nth-child(5) {
      width: 200px;
    }
  }
`;

const Loader = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 20px;
  }
`;

const CopyRight = styled.span`
  display: block;
  text-align: center;
  margin: 100px 0 60px 0;
  font-size: 15px;
  font-family: "Times New Roman", Times, serif;
  color: #4e4d4e;
`;

const medal = [gold, silver, iron];

const Ranking = () => {
  const [length, setLength] = useState(15);
  const [hasMore, setHasMore] = useState(true);

  const { data } = useQuery(SEE_RANKING_MUTATION);

  const fetchData = () => {
    setLength((prev) => prev + 15);
    if (length > data.seeRanking.length) {
      setHasMore(false);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      {data !== undefined ? (
        <InfiniteScroll
          dataLength={length}
          next={fetchData}
          hasMore={hasMore}
          loader={
            <Loader>
              <span>Loading...</span>
            </Loader>
          }
          endMessage={<CopyRight>Copyright ⓒ jinhyukSeo777 2023</CopyRight>}
        >
          <Container>
            <LightBanner url={logo5} />
            <RankerBoxs>
              {data?.seeRanking.slice(0, 3).map((value: any, idx: number) => (
                <RankerBox key={idx}>
                  <div>
                    <img src={medal[idx]} alt={value.username} />
                    <span>{idx + 1}위</span>
                  </div>
                  <div>
                    <LeftBox
                      url={value.avatar}
                      onClick={() => navigate(`/profile/${value.id}`)}
                    >
                      <div></div>
                      <span>{value.username}</span>
                    </LeftBox>
                    <RightBox>
                      <span>
                        {value.totalWin}승 {value.totalLose}패
                      </span>
                      <span>{value.score}점</span>
                      <span>
                        {value.score === 0
                          ? "0"
                          : (
                              (value.totalWin /
                                (value.totalWin + value.totalLose)) *
                              100
                            ).toFixed(2)}
                        %
                      </span>
                    </RightBox>
                  </div>
                </RankerBox>
              ))}
            </RankerBoxs>
            <RankingBoxs>
              <RankingBox>
                <span>#</span>
                <span>닉네임</span>
                <span>전적</span>
                <span>점수</span>
                <span>승률</span>
              </RankingBox>
              {data?.seeRanking
                .slice(3, 3 + length)
                .map((value: any, index: number) => (
                  <RankingBox
                    key={index}
                    onClick={() => navigate(`/profile/${value.id}`)}
                  >
                    <span>{3 + 1 + index}</span>
                    <span>{value.username}</span>
                    <span>
                      {value.totalWin}승 {value.totalLose}패
                    </span>
                    <span>{value.score}점</span>
                    <span>
                      {value.score === 0
                        ? "0"
                        : (
                            (value.totalWin /
                              (value.totalWin + value.totalLose)) *
                            100
                          ).toFixed(2)}
                      %
                    </span>
                  </RankingBox>
                ))}
            </RankingBoxs>
          </Container>
        </InfiniteScroll>
      ) : (
        <LoaderComponent />
      )}
    </>
  );
};

export default Ranking;
