import { styled } from "styled-components";
import { CopyRight } from "./Home";
import { useNavigate, useParams } from "react-router-dom";
import { greenColor } from "../color";
import { gql, useMutation, useQuery } from "@apollo/client";
import useUser from "../useUser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
const person = require("../img/person.png");

const SEE_PROFILE_MUTATION = gql`
  query seeProfile($id: Int!) {
    seeProfile(id: $id) {
      id
      username
      email
      summary
      avatar
      totalWin
      totalLose
      score
      Match {
        matchId
      }
    }
  }
`;

const SEE_MATCHES_MUTATION = gql`
  query seeMatches($id: [Int]!) {
    seeMatches(id: $id) {
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
    }
  }
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation Mutation(
    $username: String
    $email: String
    $summary: String
    $avatar: Upload
  ) {
    editProfile(
      username: $username
      email: $email
      summary: $summary
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

const Background = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 1000px;
  margin-top: 110px;
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
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
    border: none;
    cursor: pointer;
  }
`;

const MyPage = styled.span`
  color: black;
  font-size: 40px;
  font-family: "Times New Roman", Times, serif;
`;

const ProfileBox = styled.div`
  width: 100%;
  margin-top: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 30px;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:first-child {
    align-items: center;
    margin-right: 150px;
  }
  textarea {
    margin-top: 20px;
    width: 390px;
    height: 200px;
    border: 1px solid ${greenColor};
    resize: none;
    outline: none;
    border-radius: 15px;
    padding: 15px;
  }
  span {
    margin-top: 25px;
    &:first-child {
      font-size: 30px;
    }
    &:nth-child(2) {
      font-size: 30px;
    }
    &:nth-child(3) {
      font-size: 18px;
    }
    &:last-child {
      font-size: 16px;
    }
  }
  label {
    margin: 15px 0 0px 0;
    font-weight: bold;
    font-size: 15px;
    color: #0095f6;
    display: inline-block;
    cursor: pointer;
  }
`;

const Input = styled.input`
  margin-top: 20px;
  height: 25px;
  width: 150px;
  border-radius: 10px;
  outline: none;
  text-indent: 10px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  &:focus {
    border: 2px solid rgba(21, 83, 177, 0.2);
  }
`;

const Avatar = styled.div<{ url: string | null }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: black;
  background-image: url(${({ url }) => (url ? url : person)});
  background-size: cover;
  background-position: center;
`;

const ScoreBox = styled.div`
  width: 100%;
  padding: 30px;
  margin: 20px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  > span {
    font-size: 35px;
  }
  > div {
    margin-top: 30px;
    display: flex;
    align-items: center;
    div {
      &:first-child {
        margin-right: 40px;
      }
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 100px;
      border-radius: 15px;
      border: 1px solid ${greenColor};
      span {
        &:first-child {
          font-size: 25px;
          margin-bottom: 15px;
        }
      }
    }
  }
`;

const EnrollMatchBox = styled.div`
  width: 100%;
  padding: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  > span {
    font-size: 35px;
  }
  div {
    width: 100%;
    display: flex;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      cursor: pointer;
    }
    span {
      width: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const ResultMatchBox = styled(EnrollMatchBox)`
  border: none;
`;

interface FormData {
  username: String;
  email: String;
  summary: String;
  file: any;
}

const Profile = () => {
  const { id } = useParams();
  const { data: myData } = useUser();
  const [IsEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState();
  const [newAvatar, setNewAvatar] = useState("");
  const navigate = useNavigate();

  const { register, getValues } = useForm<FormData>();

  const { data } = useQuery(SEE_PROFILE_MUTATION, {
    variables: { id: Number(id) },
  });

  let matchIdArr = [];
  for (let i = 0; i < data?.seeProfile?.Match.length; i++) {
    matchIdArr.push(data?.seeProfile?.Match[i].matchId);
  }

  const { data: data2 } = useQuery(SEE_MATCHES_MUTATION, {
    variables: {
      id: matchIdArr,
    },
  });

  const onCompleted = (data: any) => {
    const {
      editProfile: { ok, error },
    } = data;
    if (!ok) {
      window.confirm(error);
    } else {
      window.location.reload();
    }
  };

  const [editProfile, loading] = useMutation(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const onClicked = () => {
    const { username, email, summary } = getValues();

    editProfile({
      variables: {
        ...(username !== "" && { username }),
        ...(email !== "" && { email }),
        summary,
        ...(avatarFile !== undefined && { avatar: avatarFile }),
      },
    });
  };

  const onChange = (e: any) => {
    if (e.target.files.length === 0) return;
    const {
      target: {
        files: [file],
      },
    } = e;
    setAvatarFile(file);

    var reader = new FileReader();
    reader.onload = function (event: any) {
      setNewAvatar(event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const date = new Date();
  const number = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateString = `${year}-${month}-${number}`;

  return (
    <>
      {data !== undefined && data2 !== undefined ? (
        <Background>
          <Container>
            <ProfileHeader>
              <MyPage>MyPage</MyPage>
              {id === myData?.myProfile?.id + "" ? (
                IsEditing ? (
                  <button
                    disabled={loading.loading ? true : false}
                    style={{ opacity: loading.loading ? "0.5" : "1" }}
                    onClick={() => onClicked()}
                  >
                    수정완료
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)}>수정하기</button>
                )
              ) : null}
            </ProfileHeader>
            <ProfileBox>
              <Div>
                <Avatar
                  url={newAvatar ? newAvatar : data.seeProfile.avatar}
                ></Avatar>
                {IsEditing ? (
                  <>
                    <label
                      className="signup-profileImg-label"
                      htmlFor="profileImg"
                    >
                      프로필 이미지 변경
                    </label>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      accept="image/*"
                      id="profileImg"
                      onChange={(e: any) => onChange(e)}
                    />
                  </>
                ) : null}
                {IsEditing ? (
                  <>
                    <Input
                      {...register("username")}
                      type="text"
                      placeholder={myData.myProfile?.username}
                    />
                    <Input
                      {...register("email")}
                      type="text"
                      placeholder={myData.myProfile?.email}
                    />
                  </>
                ) : (
                  <>
                    <span>{data.seeProfile.username}</span>
                    <span>{data.seeProfile.email}</span>
                  </>
                )}
              </Div>
              <Div>
                <span>자기소개</span>
                {IsEditing ? (
                  <textarea
                    {...register("summary")}
                    placeholder={myData.myProfile?.summary}
                  />
                ) : (
                  <textarea readOnly value={data.seeProfile.summary}></textarea>
                )}
              </Div>
            </ProfileBox>
            <ScoreBox>
              <span>등급</span>
              <div>
                <div>
                  <span>총 전적</span>
                  <span>
                    {data.seeProfile.totalWin}승 {data.seeProfile.totalLose}패
                  </span>
                </div>
                <div>
                  <span>승점</span>
                  <span>{data.seeProfile.score}점</span>
                </div>
              </div>
            </ScoreBox>
            <EnrollMatchBox>
              <span>등록 매치 현황</span>
              <div
                style={{
                  marginTop: "30px",
                  backgroundColor: "#e3f0e4",
                }}
              >
                <span>매치 이름</span>
                <span>매치 타입</span>
                <span>경기 날짜</span>
              </div>
              {data2.seeMatches
                ?.filter((e: any) => e.date >= dateString)
                .map((value: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/match/${value.id}`)}
                  >
                    <span>{value.title}</span>
                    <span>{value.isSingle ? "단식" : "복식"}</span>
                    <span>{value.date}</span>
                  </div>
                ))}
            </EnrollMatchBox>
            <ResultMatchBox>
              <span>지난 매치 현황</span>
              <div
                style={{
                  marginTop: "30px",
                  backgroundColor: "#e3f0e4",
                }}
              >
                {/* <span>승/패</span> */}
                <span>매치 이름</span>
                <span>매치 타입</span>
                <span>경기 날짜</span>
              </div>
              {data2.seeMatches
                ?.filter((e: any) => e.date < dateString)
                .map((value: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/match/${value.id}`)}
                  >
                    <span>{value.title}</span>
                    <span>{value.isSingle ? "단식" : "복식"}</span>
                    <span>{value.date}</span>
                  </div>
                ))}
            </ResultMatchBox>
          </Container>
          <CopyRight>Copyright ⓒ jinhyukSeo777 2023</CopyRight>
        </Background>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Profile;
