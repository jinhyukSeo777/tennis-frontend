import { LoginBox, Overlay, LoginBoxHeader } from "./LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  submitLocation,
  toggleEnroll,
  toggleLocation,
} from "../../counterSlice";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { RootState } from "../../store";
import { gql, useMutation } from "@apollo/client";
import useUser from "../../useUser";
import { greenColor } from "../../color";

const CREATE_MATCH_MUTATION = gql`
  mutation createMatch(
    $title: String!
    $date: String!
    $startTime: String!
    $endTime: String!
    $isSingle: Boolean!
    $isInside: Boolean!
    $storeName: String!
    $address: String!
    $summary: String
    $lat: Float!
    $lng: Float!
    $userId: Int!
  ) {
    createMatch(
      title: $title
      date: $date
      startTime: $startTime
      endTime: $endTime
      isSingle: $isSingle
      isInside: $isInside
      storeName: $storeName
      address: $address
      summary: $summary
      lat: $lat
      lng: $lng
      userId: $userId
    ) {
      ok
      error
    }
  }
`;

const Form = styled.form``;

const Input = styled.input`
  width: 96%;
  height: 35px;
  border-radius: 5px;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0 10px;
  &:focus {
    border: 2px solid rgba(21, 83, 177, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 96%;
  height: 150px;
  border-radius: 5px;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 10px;
  resize: none;
  &:focus {
    border: 2px solid rgba(21, 83, 177, 0.2);
  }
`;

const Box = styled.div`
  margin: 25px 20px 0px 20px;
  div {
    &:first-child {
      margin-bottom: 10px;
      span {
        &:first-child {
          font-size: 19px;
        }
        &:nth-child(2) {
          color: red;
        }
      }
    }
    &:last-child {
      display: flex;
      align-items: center;
      input {
        width: 19px;
        height: 19px;
        margin-right: 20px;
      }
    }
  }
`;

const ButtonsBox = styled.div`
  margin: 30px 0px 15px 0px;
  display: flex;
  justify-content: end;
  button {
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
    &:first-child {
      width: 100px;
      background-color: #d66363;
    }
    &:last-child {
      width: 120px;
      background-color: ${greenColor};
      margin: 0 20px;
    }
  }
`;

const overlayVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

interface FormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  many: string;
  side: string;
  text: string;
  location: string;
}

const MatchForm = () => {
  const onCompleted = (data: any) => {
    const {
      createMatch: { ok, error },
    } = data;
    if (!ok) {
      console.log(error);
    } else {
      onCloseClicked();
      window.location.reload();
    }
  };
  const [createMatch, loading] = useMutation(CREATE_MATCH_MUTATION, {
    onCompleted,
  });

  const [startTime, setStartTime] = useState<string>("9:00");

  const location = useSelector((state: RootState) => state.counter.location);

  const dispatch = useDispatch();

  const { register, getValues, handleSubmit } = useForm<FormData>();

  const getFirstDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const getLastDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 13);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const onCloseClicked = () => {
    dispatch(
      submitLocation({
        title: "",
        address: "",
        lat: 0,
        lng: 0,
      })
    );
    dispatch(toggleEnroll());
  };

  const { data: myData } = useUser();

  const onSubmitValid = () => {
    const { title, date, startTime, endTime, many, side, text } = getValues();
    createMatch({
      variables: {
        title,
        date,
        startTime,
        endTime,
        isSingle: many === "single" ? true : false,
        isInside: side === "inside" ? true : false,
        summary: text,
        storeName: location.title,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
        userId: myData?.myProfile?.id,
      },
    });
  };

  return (
    <Overlay
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <LoginBox>
        <LoginBoxHeader>
          <span style={{ fontWeight: "600" }}>매치 생성</span>
          <span onClick={onCloseClicked}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </LoginBoxHeader>
        <Form onSubmit={handleSubmit(onSubmitValid)}>
          <Box>
            <div>
              <span>매치 이름</span>
              <span>*</span>
            </div>
            <Input
              {...register("title", { required: true })}
              type="text"
              placeholder="매치 이름을 입력해주세요"
            />
          </Box>
          <Box>
            <div>
              <span>매치 날짜</span>
              <span>*</span>
            </div>
            <Input
              {...register("date", { required: true })}
              type="date"
              min={getFirstDate()}
              max={getLastDate()}
            />
          </Box>
          <Box>
            <div>
              <span>시작 시간</span>
              <span>*</span>
            </div>
            <Input
              {...register("startTime", { required: true })}
              onChange={(e: any) => setStartTime(e.target.value)}
              min="09:00"
              max="17:00"
              type="time"
            />
          </Box>
          <Box>
            <div>
              <span>종료 시간</span>
              <span>*</span>
            </div>
            <Input
              {...register("endTime", { required: true })}
              min={startTime}
              max="18:00"
              type="time"
            />
          </Box>
          <Box>
            <div>
              <span>매치 종류</span>
              <span>*</span>
            </div>
            <div>
              <span>단식</span>
              <Input
                {...register("many", { required: true })}
                value="single"
                name="many"
                type="radio"
              />
              <span>복식</span>
              <Input
                {...register("many", { required: true })}
                value="mulit"
                name="many"
                type="radio"
              />
            </div>
          </Box>
          <Box>
            <div>
              <span>코트 종류</span>
              <span>*</span>
            </div>
            <div>
              <span>실내</span>
              <Input
                {...register("side", { required: true })}
                value="inside"
                name="side"
                type="radio"
              />
              <span>실외</span>
              <Input
                {...register("side", { required: true })}
                value="outside"
                name="side"
                type="radio"
              />
            </div>
          </Box>
          <Box>
            <div>
              <span>매치 소개</span>
            </div>
            <TextArea
              {...register("text")}
              placeholder="매치 소개를 입력해주세요"
            />
          </Box>
          <Box>
            <div>
              <span>매치 장소</span>
              <span>*</span>
            </div>
            <Input
              onClick={() => dispatch(toggleLocation())}
              {...register("location", { required: true })}
              type="text"
              placeholder="매치 장소를 입력해주세요"
              value={location?.title}
            />
          </Box>
          <ButtonsBox>
            <button onClick={onCloseClicked}>취소</button>
            <button
              disabled={loading.loading ? true : false}
              style={{ opacity: loading.loading ? "0.5" : "1" }}
            >
              등록하기
            </button>
          </ButtonsBox>
        </Form>
      </LoginBox>
    </Overlay>
  );
};

export default MatchForm;
