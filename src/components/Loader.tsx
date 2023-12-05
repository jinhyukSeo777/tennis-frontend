import { ScaleLoader } from "react-spinners";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 100;
  background-color: white;
`;

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;

const Loader = () => {
  return (
    <Container>
      <Box>
        <ScaleLoader color="rgba(0,0,0,0.8)" />
      </Box>
    </Container>
  );
};

export default Loader;
