import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { LightBanner } from "../components/banner/Banner";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import {
  faPerson,
  faHome,
  faBan,
  faTruckMedical,
  faHeartPulse,
  faTShirt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { CopyRight } from "./Home";
import { greenColor } from "../color";
import { gql, useMutation, useQuery } from "@apollo/client";
import useUser from "../useUser";
import MatchInfoProfile from "../components/MatchInfoProfile";
import Loader from "../components/Loader";
const logo1 = require("../img/1.jpg");
const vsImg = require("../img/vs.png");

const SEE_MATCH_MUTATION = gql`
  query Query($id: Int!) {
    seeMatch(id: $id) {
      id
      title
      date
      startTime
      endTime
      isSingle
      isInside
      summary
      storeName
      address
      lat
      lng
      users {
        id
        userId
      }
    }
  }
`;

const DELETE_MATCH_MUTATION = gql`
  mutation DeleteMatch($id: Int!) {
    deleteMatch(id: $id) {
      ok
      error
    }
  }
`;

const SEE_PROFILES_MUTATION = gql`
  query SeeProfiles($id: [Int]!) {
    seeProfiles(id: $id) {
      id
      username
      avatar
    }
  }
`;

const ADD_USER_MATCH_MUTATION = gql`
  mutation Mutation($matchId: Int!, $userId: Int!) {
    addUserMatch(matchId: $matchId, userId: $userId) {
      ok
      error
    }
  }
`;

const DELETE_USER_MATCH_MUTATION = gql`
  mutation DeleteUserMatch($matchId: Int!, $userId: Int!) {
    deleteUserMatch(matchId: $matchId, userId: $userId) {
      ok
      error
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
  width: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SummaryBox = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span {
      &:first-child {
        margin: 15px 0;
        font-size: 25px;
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;

const VsBox = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  img {
    margin: 0 40px;
    width: 150px;
    height: 150px;
  }
  > div {
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      font-size: 22px;
    }
  }
`;

const MatchInfoBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  margin: 10px 0;
`;

const MatchInfoLeftBox = styled.div`
  margin-right: 350px;
  display: flex;
  flex-direction: column;
  span {
    margin: 10px 0;
  }
  div {
    margin: 10px 0;
  }
  > span {
    &:nth-child(2) {
      margin-top: 35px;
      font-size: 25px;
    }
  }
`;

const MatchInfoRightBox = styled.div`
  width: 550px;
  margin-top: 10px;
  > span {
    display: block;
    margin-bottom: 40px;
  }
  div {
    margin: 15px 0;
    display: flex;
    align-items: center;
    font-size: 35px;
    color: rgba(0, 0, 0, 0.6);
    span {
      margin-left: 15px;
      font-size: 14px;
      color: black;
    }
  }
`;

const LocationBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  span {
    display: block;
    margin-bottom: 20px;
  }
`;

const CautionBox = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  span {
    margin-left: 25px;
    margin-bottom: 5px;
    opacity: 0.8;
    &:first-child {
      font-size: 20px;
      margin-left: 0;
      margin-bottom: 20px;
      opacity: 1;
    }
  }
`;

const Div = styled.div`
  width: 100%;
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Button = styled.button<{ color: String }>`
  border: none;
  cursor: pointer;
  border-radius: 7px;
  height: 60px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  background-color: ${({ color }) =>
    color === "green" ? greenColor : "#cf4c4c"};
  margin-left: 10px;
`;

const MatchInfo = () => {
  const { id } = useParams();
  const { data: myData } = useUser();

  const { data } = useQuery(SEE_MATCH_MUTATION, {
    variables: { id: Number(id) },
  });

  let userIdArr = [];
  for (let i = 0; i < data?.seeMatch?.users.length; i++) {
    userIdArr.push(data?.seeMatch?.users[i].userId);
  }

  const { data: data2 } = useQuery(SEE_PROFILES_MUTATION, {
    variables: {
      id: userIdArr,
    },
  });

  const onCompleted = (data: any) => {
    const {
      deleteMatch: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      navigate("/");
      window.location.reload();
    }
  };
  const onCompleted2 = (data: any) => {
    const {
      addUserMatch: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      navigate("/");
      window.location.reload();
    }
  };
  const onCompleted3 = (data: any) => {
    const {
      deleteUserMatch: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      navigate("/");
      window.location.reload();
    }
  };

  const [deleteMatch] = useMutation(DELETE_MATCH_MUTATION, {
    onCompleted,
  });
  const [addUserMatch] = useMutation(ADD_USER_MATCH_MUTATION, {
    onCompleted: onCompleted2,
  });
  const [deleteUserMatch] = useMutation(DELETE_USER_MATCH_MUTATION, {
    onCompleted: onCompleted3,
  });

  const onClicked = () => {
    deleteMatch({
      variables: { id: Number(id) },
    });
  };
  const onEnrollClicked = () => {
    addUserMatch({
      variables: { matchId: data?.seeMatch?.id, userId: myData?.myProfile?.id },
    });
  };
  const onCancleClicked = () => {
    deleteUserMatch({
      variables: { matchId: data?.seeMatch?.id, userId: myData?.myProfile?.id },
    });
  };

  const navigate = useNavigate();

  const isAlreayEnrolled = () => {
    if (
      data?.seeMatch?.users[1]?.userId === myData?.myProfile?.id ||
      data?.seeMatch?.users[2]?.userId === myData?.myProfile?.id ||
      data?.seeMatch?.users[3]?.userId === myData?.myProfile?.id
    ) {
      return true;
    }
    return false;
  };

  const isFull = () => {
    if (data?.seeMatch?.isSingle && data?.seeMatch?.users.length === 2) {
      return true;
    } else if (
      !data?.seeMatch?.isSingle &&
      data?.seeMatch?.users.length === 4
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {data && data2 ? (
        <Container>
          <LightBanner url={logo1} />
          <Content>
            <SummaryBox>
              <div>
                <span>
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <span>{data?.seeMatch.date}</span>
              </div>
              <div>
                <span>
                  <FontAwesomeIcon icon={faClock} />
                </span>
                <span>
                  {data?.seeMatch.startTime} ~ {data?.seeMatch.endTime}
                </span>
              </div>
              <div>
                <span>
                  <FontAwesomeIcon icon={faPerson} />
                </span>
                <span>{data?.seeMatch.isSingle ? "단식" : "복식"}</span>
              </div>
              <div>
                <span>
                  <FontAwesomeIcon icon={faHome} />
                </span>
                <span>{data?.seeMatch.isInside ? "실내" : "실외"}</span>
              </div>
            </SummaryBox>
            <VsBox>
              {data.seeMatch.isSingle ? (
                <>
                  <MatchInfoProfile
                    id={data2.seeProfiles[0]?.id}
                    username={data2.seeProfiles[0].username}
                    avatar={data2.seeProfiles[0]?.avatar}
                  />
                  <img src={vsImg} alt={"vs"} />{" "}
                  <MatchInfoProfile
                    id={data2.seeProfiles[1]?.id}
                    username={data2.seeProfiles[1]?.username}
                    avatar={data2.seeProfiles[1]?.avatar}
                  />
                </>
              ) : (
                <>
                  <MatchInfoProfile
                    id={data2.seeProfiles[0]?.id}
                    username={data2.seeProfiles[0]?.username}
                    avatar={data2.seeProfiles[0]?.avatar}
                  />
                  <MatchInfoProfile
                    id={data2.seeProfiles[1]?.id}
                    username={data2.seeProfiles[1]?.username}
                    avatar={data2.seeProfiles[1]?.avatar}
                  />
                  <img src={vsImg} alt={"vs"} />{" "}
                  <MatchInfoProfile
                    id={data2.seeProfiles[2]?.id}
                    username={data2.seeProfiles[2]?.username}
                    avatar={data2.seeProfiles[2]?.avatar}
                  />
                  <MatchInfoProfile
                    id={data2.seeProfiles[3]?.id}
                    username={data2.seeProfiles[3]?.username}
                    avatar={data2.seeProfiles[3]?.avatar}
                  />
                </>
              )}
            </VsBox>
            <MatchInfoBox>
              <MatchInfoLeftBox>
                <span>매치소개</span>
                <span>{data.seeMatch.title}</span>
                <div>
                  <FontAwesomeIcon icon={faClock} />{" "}
                  <span>
                    {data.seeMatch.date} {data.seeMatch.startTime}
                  </span>
                </div>
                <span>{data.seeMatch.text}</span>
              </MatchInfoLeftBox>
              <MatchInfoRightBox>
                <span>테니스장 이용자 준수사항</span>
                <div>
                  <FontAwesomeIcon icon={faTShirt} />
                  <span>
                    코트입장시에는 필해 운동복, 테니스화를 착용하셔야 하며 볼과
                    라켓은 대여하지 않습니다
                  </span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>매칭 날짜 및 시간을 준수해주십시오</span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faBan} />{" "}
                  <span>
                    음주, 또는 항정신성 약물을 투여했다고 판단되는 사람은 안전을
                    위해 테니스장 출입이 통제됩니다
                  </span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faTruckMedical} />
                  <span>
                    안전사고 발생시 119 신고 및 관리사무실 통보하여 신속한
                    조치를 취하셔야 합니다
                  </span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faHeartPulse} />
                  <span>
                    심장, 또는 순환기 계통의 질병, 정신질환자, 노약자, 임산부
                    등은 안전을 위해 테니스장 출입이 제한됩니다
                  </span>
                </div>
              </MatchInfoRightBox>
            </MatchInfoBox>
            <LocationBox>
              <span>매치 장소</span>
              <Map
                center={{
                  lat: data?.seeMatch.lat,
                  lng: data?.seeMatch.lng,
                }}
                style={{ width: "1100px", height: "550px" }}
                level={6}
              >
                <MapMarker
                  position={{
                    lat: data?.seeMatch.lat,
                    lng: data?.seeMatch.lng,
                  }}
                  image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                    size: { width: 24, height: 35 },
                  }}
                />
              </Map>
            </LocationBox>
            <CautionBox>
              <span>매치 이용방법</span>
              <span>
                ◾ 매치 1시간전에 매치 참여자가 충족하지 못할 시 매치는 실패
                처리 됩니다
              </span>
              <span>
                ◾ 매치 2시간 전부터 매치 생성자는 매치에 대한 정보를 수정 및
                삭제할 수 없으며 참여자는 매치 참여를 취소할 수 없습니다
              </span>
              <span>
                ◾ 매치 종료 후 매치 결과 등록 버튼이 생기며 기간은 최대
                1주일입니다
              </span>
              <span>
                ◾ 결과 미 등록 및 잘못된 결과 입력시 패널티가 부여됩니다
              </span>
            </CautionBox>
            <Div>
              {myData?.myProfile?.id ? (
                data?.seeMatch?.users[0].userId === myData?.myProfile?.id ? (
                  <Button color={"red"} onClick={onClicked}>
                    매치 삭제
                  </Button>
                ) : isAlreayEnrolled() ? (
                  <Button color={"red"} onClick={onCancleClicked}>
                    등록 취소
                  </Button>
                ) : !isFull() ? (
                  <Button color={"green"} onClick={onEnrollClicked}>
                    매치 등록
                  </Button>
                ) : null
              ) : null}
            </Div>
          </Content>
          <CopyRight>Copyright ⓒ jinhyukSeo777 2023</CopyRight>
        </Container>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MatchInfo;
