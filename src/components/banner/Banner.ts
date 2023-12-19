import styled from "styled-components";

export const DarkBanner = styled.div<{ url: string }>`
  width: 100%;
  height: 500px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url(${({ url }) => url});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    color: white;
    font-family: "Times New Roman", Times, serif;
    margin: 10px 0;
    &:first-child {
      font-size: 70px;
    }
    &:last-child {
      opacity: 0.8;
      font-size: 22px;
    }
  }
`;

export const LightBanner = styled.div<{ url: string }>`
  width: 100%;
  height: 500px;
  background-image: url(${({ url }) => url});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    color: white;
    font-family: "Times New Roman", Times, serif;
    margin: 10px 0;
    &:first-child {
      font-size: 70px;
    }
    &:last-child {
      opacity: 0.8;
      font-size: 22px;
    }
  }
`;
