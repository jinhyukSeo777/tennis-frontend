import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { greenColor } from "../color";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0 25px 0;
`;

const DatesBox = styled.div`
  width: 650px;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
`;

const Button = styled.div`
  color: ${greenColor};
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
`;

const LeftButton = styled(Button)<{ index: number }>`
  left: -50px;
  top: 18px;
  opacity: ${({ index }) => (index === 0 ? "0.3" : "0.9")};
`;

const RightButton = styled(Button)<{ index: number }>`
  right: -50px;
  top: 18px;
  opacity: ${({ index }) => (index === 7 ? "0.3" : "0.9")};
`;

const DateBox = styled.div<{ istargeted: string; textcolor: string }>`
  width: 80px;
  height: 60px;
  border-radius: 10px;
  background-color: ${({ istargeted }) =>
    istargeted === "yes" ? "rgba(55, 169, 101, 0.8)" : "white"};
  color: ${({ istargeted, textcolor }) =>
    istargeted === "yes" ? "white" : textcolor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(55, 169, 101, 0.8);
  }
  span {
    &:first-child {
      font-size: 20px;
    }
    &:last-child {
      margin-top: 5px;
      font-size: 16px;
    }
  }
`;

interface DatesInt {
  number: number;
  month: number;
  year: number;
  weekend: string | undefined;
}

interface Prop {
  dateString: String | undefined;
}

const DateSelector = ({ dateString }: Prop) => {
  let Dates: DatesInt[] = [];

  const date = new Date();

  const getWeekend = (day: number) => {
    if (day === 0) {
      return "일";
    }
    if (day === 1) {
      return "월";
    }
    if (day === 2) {
      return "화";
    }
    if (day === 3) {
      return "수";
    }
    if (day === 4) {
      return "목";
    }
    if (day === 5) {
      return "금";
    }
    if (day === 6) {
      return "토";
    }
  };

  for (let i = 0; i < 15; i++) {
    Dates.push({
      number: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      weekend: getWeekend(date.getDay()),
    });
    date.setDate(date.getDate() + 1);
  }

  const [index, setIndex] = useState(0);

  const onLeftClicked = () => {
    if (index === 0) {
      return;
    }
    setIndex((prevIndex) => prevIndex - 1);
  };

  const onRightClicked = () => {
    if (index === 7) {
      return;
    }
    setIndex((prevIndex) => prevIndex + 1);
  };

  const getTextColor = (weeekend: string | undefined) => {
    if (weeekend === "토") {
      return "blue";
    }
    if (weeekend === "일") {
      return "red";
    }
    return "black";
  };

  const navigate = useNavigate();

  const onClicked = (value: any) => {
    const { number, year, month } = value;
    navigate(`/matching/${year}${month}${number}`);
  };

  return (
    <Container>
      <DatesBox>
        <LeftButton index={index} onClick={onLeftClicked}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </LeftButton>
        <RightButton index={index} onClick={onRightClicked}>
          <FontAwesomeIcon icon={faAngleRight} />
        </RightButton>
        {Dates.slice(index, index + 7).map((value, idx) => (
          <DateBox
            onClick={() => onClicked(value)}
            key={idx}
            istargeted={value.number === Number(dateString) ? "yes" : "no"}
            textcolor={getTextColor(value.weekend)}
          >
            <span>{value.number}</span>
            <span>{value.weekend}</span>
          </DateBox>
        ))}
      </DatesBox>
    </Container>
  );
};

export default DateSelector;
