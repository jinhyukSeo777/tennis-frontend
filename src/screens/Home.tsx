import { styled } from "styled-components";
import HomeBanner from "../components/banner/HomeBanner";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const logo2 = require("../img/1.jpg");
const logo3 = require("../img/2.jpg");
const logo1 = require("../img/3.jpg");

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
  width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextBox1 = styled.div`
  width: 100%;
  margin-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    &:first-child {
      font-size: 35px;
      font-weight: 600;
      letter-spacing: 1px;
      font-family: "Times New Roman", Times, serif;
    }
    &:last-child {
      margin-top: 25px;
      font-size: 15px;
      opacity: 0.9;
      color: #4e4d4e;
    }
  }
`;

const TextBox2 = styled.div`
  width: 900px;
  margin: 0 auto;
  margin-top: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 60px;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  span {
    &:first-child {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 1px;
    }
    &:last-child {
      margin-top: 25px;
      font-size: 15px;
      opacity: 0.9;
      color: #4e4d4e;
    }
  }
`;

const TextBox3 = styled.div`
  width: 100%;
  margin-top: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    &:first-child {
      font-size: 35px;
      font-weight: 600;
      letter-spacing: 1px;
      font-family: "Times New Roman", Times, serif;
    }
    &:last-child {
      margin-top: 25px;
      font-size: 14px;
      opacity: 0.9;
      color: #4e4d4e;
    }
  }
`;

const TextBox4 = styled(TextBox2)`
  width: 1100px;
  padding: 0;
  div {
    width: 310px;
    text-align: center;
  }
  span {
    &:last-child {
      margin-top: 15px;
      font-size: 15px;
      line-height: 25px;
      color: #4e4d4e;
    }
  }
`;

const PhotoBox = styled.div`
  width: 900px;
  height: 1300px;
  margin-top: 40px;
  background-image: url(${logo1});
  background-size: cover;
  background-position: center;
`;

const GridBox = styled.div`
  width: 100%;
  height: 1200px;
  margin: 100px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:first-child {
      background-image: url(${logo2});
      background-size: cover;
      background-position: center;
    }
    &:last-child {
      background-image: url(${logo3});
      background-size: cover;
      background-position: center;
    }
    span {
      text-align: center;
      width: 280px;
      &:first-child {
        font-size: 25px;
        font-weight: 600;
        letter-spacing: 1px;
      }
      &:nth-child(2) {
        margin: 25px 0;
        font-size: 16px;
        opacity: 0.9;
        color: #4e4d4e;
      }
      &:nth-child(3) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 250px;
        height: 65px;
        border-radius: 40px;
        background-color: #69d802;
        color: white;
        cursor: pointer;
        font-weight: 600;
        font-size: 20px;
      }
    }
  }
`;

export const CopyRight = styled.span`
  margin: 50px 0 60px 0;
  font-size: 15px;
  font-family: "Times New Roman", Times, serif;
  color: #4e4d4e;
  opacity: 0.9;
`;

const Home = () => {
  const navigate = useNavigate();

  const date = new Date();
  const number = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta property="og:site_name" content="tennis" />
        <meta property="og:title" content="home" />
        <meta
          property="og:url"
          content="https://tennis-frontend-plum.vercel.app/"
        />
        <meta property="og:description" content="tennis web for portfolio" />
      </Helmet>
      <Container>
        <HomeBanner />
        <Content>
          <TextBox1>
            <span>GOGOTENNIS</span>
            <span>소셜 테니스 고고테니스</span>
          </TextBox1>
          <TextBox2>
            <div>
              <span>내가 하고 싶을 때</span>
              <span>매일매일 아침부터 밤까지</span>
            </div>
            <div>
              <span>내가 하고 싶은 곳에서</span>
              <span>집 앞, 학교, 회사 여행 간 도시 어디서나</span>
            </div>
            <div>
              <span>내가 하고 싶은 사람들과</span>
              <span>혼자, 친구랑, 함께, 새로운 사람들과</span>
            </div>
          </TextBox2>
          <TextBox3>
            <span>HOW TO</span>
            <span>고고테니스 이용방법</span>
          </TextBox3>
          <PhotoBox></PhotoBox>
          <TextBox4>
            <div>
              <span>친절한 매칭시스템</span>
              <span>
                다른 사람들과의 전적을 확인하고 원하는 장소, 날짜를 선택해
                매치를 진행하세요
              </span>
            </div>
            <div>
              <span>건강한 테니스 문화</span>
              <span>
                경쟁보다 배려와 재미를 추구합니다 신고 제도로 비매너 유저 참가를
                제한해요
              </span>
            </div>
            <div>
              <span>레벨 데이터로 막상막하 매치</span>
              <span>
                비슷한 레벨의 사람들과 경기를 진행하여 팽팽하고 스릴넘치는
                경기를 즐겨보세요
              </span>
            </div>
          </TextBox4>
          <GridBox>
            <div></div>
            <div>
              <span>"일취월장한 실력으로 대회에 도전해 보세요"</span>
              <span>일일 테니스 매치 고고테니스</span>
            </div>
            <div>
              <span>지금 가입하고 언제든 할 수 있어요</span>
              <span>일일 테니스 매치 고고테니스</span>
              <span
                onClick={() => navigate(`/matching/${year}${month}${number}`)}
              >
                매치 보러가기
              </span>
              <div></div>
            </div>
            <div></div>
          </GridBox>
        </Content>
        <CopyRight>Copyright ⓒ jinhyukSeo777 2023</CopyRight>
      </Container>
    </>
  );
};

export default Home;
