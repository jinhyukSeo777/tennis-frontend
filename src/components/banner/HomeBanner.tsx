import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
const logo1 = require("../../img/1.jpg");
const logo2 = require("../../img/2.jpg");

const BannerBox = styled.div`
  width: 100%;
  height: 570px;
  position: relative;
`;

const Photo = styled(motion.div)<{ page: number }>`
  width: 100%;
  height: 100%;
  background-image: url(${({ page }) => (page === 1 ? logo1 : logo2)});
  background-size: cover;
  background-position: center;
  position: absolute;
`;

const Button = styled.div`
  color: white;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  opacity: 0.7;
  cursor: pointer;
`;

const LeftButton = styled(Button)`
  left: 45px;
  top: 250px;
`;

const RightButton = styled(Button)`
  top: 250px;
  right: 45px;
`;

const DivBox = styled.div`
  display: flex;
  width: 45px;
  height: 25px;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Div = styled.div<{ isme: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: white;
  opacity: ${({ isme }) => (isme === "true" ? "0.6" : "0.4")};
  cursor: pointer;
`;

const box = {
  initial: {
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1 },
  },
};

const HomeBanner = () => {
  const [visible, setVisible] = useState(1);
  const nextPlease = () => {
    setVisible((prev) => (prev === 2 ? 1 : prev + 1));
  };
  const prevPlease = () => {
    setVisible((prev) => (prev === 1 ? 2 : prev - 1));
  };

  return (
    <BannerBox>
      <AnimatePresence initial={false}>
        <Photo
          page={visible}
          variants={box}
          initial="initial"
          animate="animate"
          exit="exit"
          key={visible}
        ></Photo>
      </AnimatePresence>
      <LeftButton onClick={nextPlease}>
        <FontAwesomeIcon icon={faAngleLeft} />
      </LeftButton>
      <RightButton onClick={prevPlease}>
        <FontAwesomeIcon icon={faAngleRight} />
      </RightButton>
      <DivBox>
        <Div
          isme={visible === 1 ? "true" : "false"}
          onClick={() => setVisible(1)}
        ></Div>
        <Div
          isme={visible === 2 ? "true" : "false"}
          onClick={() => setVisible(2)}
        ></Div>
      </DivBox>
    </BannerBox>
  );
};

export default HomeBanner;
