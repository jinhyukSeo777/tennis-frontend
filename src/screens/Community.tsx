import styled from "styled-components";
import { LightBanner } from "../components/banner/Banner";
import {
  faMagnifyingGlass,
  faComment,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CopyRight } from "./Home";
import { useNavigate, useParams } from "react-router-dom";
import { greenColor } from "../color";
import { gql, useMutation, useQuery } from "@apollo/client";
import Writting from "../components/form/Writting";
import useUser from "../useUser";
import { useDispatch, useSelector } from "react-redux";
import { toggleCreateFeed } from "../counterSlice";
import { RootState } from "../store";
import CreateFeedForm from "../components/form/CreateFeedForm";
import Loader from "../components/Loader";
const logo4 = require("../img/4.jpg");

const SEE_FEEDS_MUTATION = gql`
  query Query {
    seeFeeds {
      id
      title
      text
      commentNum
      see
      createdAt
      user {
        avatar
        username
      }
    }
  }
`;

const SEE_HOT_FEEDS_MUTATION = gql`
  query Query {
    seeHotFeeds {
      id
      title
      text
      commentNum
      see
      createdAt
      user {
        avatar
        username
      }
    }
  }
`;

const SEARCH_FEED_MUTATION = gql`
  mutation Mutation($keyword: String) {
    searchFeed(keyword: $keyword) {
      id
      title
      text
      commentNum
      see
      createdAt
      user {
        avatar
        username
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

const Content = styled.div<{ long: number }>`
  width: 100%;
  height: ${({ long }) => (long ? "1550px" : "1250px")};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const LeftBox = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const LeftBoxOptions = styled.div<{ isclicked: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  &:first-child {
    height: 120px;
    font-size: 23px;
  }
  &:not(:first-child) {
    background-color: ${({ isclicked }) =>
      isclicked ? `${greenColor}` : "white"};
    color: ${({ isclicked }) => (isclicked ? "white" : "black")};
    border: ${({ isclicked }) => (isclicked ? "none" : null)};
    cursor: pointer;
  }
`;

const MiddleBox = styled.div`
  flex-grow: 1;
  height: 100%;
  padding: 0 25px;
`;

const MiddleTopBox = styled.div`
  height: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 1);
  position: relative;
`;

const InputBox = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 250px;
  height: 44px;
  border-radius: 22px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  outline: none;
  text-indent: 10px;
`;

const GlassFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 14px;
  right: 15px;
  font-size: 23px;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 7px;
  height: 50px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  background-color: ${greenColor};
  position: absolute;
  right: 15px;
  bottom: 20px;
`;

const MiddleBottomBox = styled.div`
  height: 100%;
  height: 1020px;
`;

const Post = styled.div`
  margin: 10px 0px;
  width: 100%;
  &:not(:nth-child(10)) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  cursor: pointer;
  > div {
    margin: 5px 10px;
    display: flex;
    &:nth-child(1) {
      font-size: 14px;
      span {
        margin-right: 10px;
      }
    }
    &:nth-child(2) {
      font-size: 19px;
      margin: 18px 10px;
      color: #2e2d2d;
    }
    &:nth-child(3) {
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      div {
        display: flex;
        span {
          margin-right: 5px;
          font-size: 14px;
        }
      }
    }
  }
`;

const FontAwesomeIcons = styled(FontAwesomeIcon)`
  opacity: 0.7;
`;

const Avatar = styled.div<{ url: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: center;
  cursor: pointer;
`;

const RightBox = styled.div`
  width: 210px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  > div {
    &:first-child {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
      font-size: 23px;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
`;

const HotPost = styled.div`
  width: 210px;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;
  > div {
    margin: 4px 0;
    &:first-child {
      width: 210px;
      font-size: 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:last-child {
      font-size: 11px;
      span {
        margin-right: 5px;
      }
    }
  }
`;

export const PageDivs = styled.div`
  display: flex;
  margin-top: 40px;
`;

export const PageDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  color: ${greenColor};
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

interface FormData {
  keyword: string;
  text: string;
}

const Community = () => {
  const { id } = useParams();
  const { data: myData } = useUser();
  const dispatch = useDispatch();
  const createFeed = useSelector(
    (state: RootState) => state.counter.isCreateFeed
  );

  const navigate = useNavigate();

  const [clickedNumber, setClickedNumber] = useState(0);

  const leftBoxClicked = (index: number) => {
    setClickedNumber(index);
  };

  const { register, getValues, handleSubmit } = useForm<FormData>();

  const [searchedFeeds, setSearchedFeeds] = useState([]);
  const [searched, setSearched] = useState(false);
  const onCompleted = (data: any) => {
    setSearched(true);
    const { searchFeed } = data;
    setSearchedFeeds(searchFeed);
  };

  const [searchFeed] = useMutation(SEARCH_FEED_MUTATION, {
    onCompleted,
  });

  const onKeywordSubmit = () => {
    const { keyword } = getValues();
    searchFeed({
      variables: {
        keyword,
      },
    });
  };

  const { data } = useQuery(SEE_FEEDS_MUTATION);
  const { data: hotFeeds } = useQuery(SEE_HOT_FEEDS_MUTATION);

  const [page, setPage] = useState(1);
  const totalPage = Math.floor(data?.seeFeeds?.length / 10) + 1;
  let arr = [];
  for (let i = 1; i <= totalPage; i++) {
    arr.push(i);
  }
  const pageClicked = (value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const calDate = (date: number) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <>
      {data && hotFeeds ? (
        <Container>
          <LightBanner url={logo4}>
            <span>Community</span>
            <span>come and join!</span>
          </LightBanner>
          <Content long={id ? 1 : 0}>
            <LeftBox>
              <LeftBoxOptions isclicked={0}>
                <span>커뮤니티</span>
              </LeftBoxOptions>
              <LeftBoxOptions
                onClick={() => leftBoxClicked(0)}
                isclicked={clickedNumber === 0 ? 1 : 0}
              >
                <span>자유게시판</span>
              </LeftBoxOptions>
              <LeftBoxOptions
                onClick={() => leftBoxClicked(1)}
                isclicked={clickedNumber === 1 ? 1 : 0}
              >
                <span>공지사항</span>
              </LeftBoxOptions>
              <LeftBoxOptions
                onClick={() => leftBoxClicked(2)}
                isclicked={clickedNumber === 2 ? 1 : 0}
              >
                <span>Q&A</span>
              </LeftBoxOptions>
            </LeftBox>
            {id ? (
              <Writting></Writting>
            ) : (
              <MiddleBox>
                <MiddleTopBox>
                  <InputBox>
                    <form onSubmit={handleSubmit(onKeywordSubmit)}>
                      <Input
                        {...register("keyword")}
                        type="text"
                        placeholder="제목, 작성자로 검색"
                      />
                    </form>
                    <GlassFontAwesomeIcon
                      onClick={handleSubmit(onKeywordSubmit)}
                      icon={faMagnifyingGlass}
                    />
                  </InputBox>
                  {myData ? (
                    <Button onClick={() => dispatch(toggleCreateFeed())}>
                      글쓰기
                    </Button>
                  ) : null}
                </MiddleTopBox>
                <MiddleBottomBox>
                  {searched
                    ? searchedFeeds
                        .slice((page - 1) * 10, (page - 1) * 10 + 10)
                        .map((value: any, index: number) => (
                          <Post
                            onClick={() => navigate(`/community/${value.id}`)}
                            key={index}
                          >
                            <div>
                              <span>{calDate(value.createdAt)}</span>
                            </div>
                            <div>{value.title}</div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar url={value.user.avatar} />
                                <span>{value.user.username}</span>
                              </div>
                              <div>
                                <span>
                                  <FontAwesomeIcons icon={faComment} />{" "}
                                  {value.commentNum}
                                </span>
                                <span>
                                  <FontAwesomeIcons icon={faEye} /> {value.see}
                                </span>
                              </div>
                            </div>
                          </Post>
                        ))
                    : data.seeFeeds
                        .slice((page - 1) * 10, (page - 1) * 10 + 10)
                        .map((value: any, index: number) => (
                          <Post
                            onClick={() => navigate(`/community/${value.id}`)}
                            key={index}
                          >
                            <div>
                              <span>{calDate(value.createdAt)}</span>
                            </div>
                            <div>{value.title}</div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar url={value.user.avatar} />
                                <span>{value.user.username}</span>
                              </div>
                              <div>
                                <span>
                                  <FontAwesomeIcons icon={faComment} />{" "}
                                  {value.commentNum}
                                </span>
                                <span>
                                  <FontAwesomeIcons icon={faEye} /> {value.see}
                                </span>
                              </div>
                            </div>
                          </Post>
                        ))}
                </MiddleBottomBox>
              </MiddleBox>
            )}
            <RightBox>
              <div>
                <span>GOGO 화제글</span>
              </div>
              {hotFeeds.seeHotFeeds.map((value: any, index: number) => (
                <HotPost
                  onClick={() => navigate(`/community/${value.id}`)}
                  key={index}
                >
                  <div>
                    <span>{value.title}</span>
                  </div>
                  <div>
                    <span>{value.user.username}</span>
                    <span>
                      <FontAwesomeIcons icon={faComment} /> {value.commentNum}
                    </span>
                    <span>
                      <FontAwesomeIcons icon={faEye} /> {value.see}
                    </span>
                  </div>
                </HotPost>
              ))}
            </RightBox>
          </Content>
          {id ? null : (
            <PageDivs>
              {arr.map((value, index) => {
                return (
                  <PageDiv key={index} onClick={() => pageClicked(value)}>
                    {value}
                  </PageDiv>
                );
              })}
            </PageDivs>
          )}
          <CopyRight style={{ marginTop: "160px" }}>
            Copyright ⓒ jinhyukSeo777 2023
          </CopyRight>
          {createFeed ? <CreateFeedForm /> : null}
        </Container>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Community;
