import { styled } from "styled-components";
import {
  LoginBox,
  LoginBoxHeader,
  Overlay,
  overlayVariants,
} from "../form/LoginForm";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { submitLocation, toggleLocation } from "../../counterSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const LocationBox = styled(LoginBox)`
  width: 1100px;
  height: 740px;
  position: relative;
`;

const LocationBoxHeader = styled(LoginBoxHeader)`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const LocationMap = styled.div`
  width: 100%;
  height: 580px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  position: absolute;
  top: 90px;
  left: 15px;
  z-index: 1;
`;

const Input = styled.input`
  width: 170px;
  height: 30px;
  border-radius: 15px;
  outline: none;
  border: 2px solid gray;
  text-indent: 10px;
`;

const locations = [
  {
    title: "서울테니스",
    address: "서울 영등포구 영중로8길 15 더위일신세계 B01호 서울테니스",
    lat: 37.5185333,
    lng: 126.907394,
  },
  {
    title: "노바테니스",
    address: "서울 양천구 목동동로 233-3 삼성화재서비스빌딩 5층",
    lat: 37.5278967,
    lng: 126.871486,
  },
  {
    title: "강남 삼성동 위드 실내 테니스장",
    address: "서울 강남구 삼성로 566 빌딩엠 지하 1층",
    lat: 37.5121077,
    lng: 127.054283,
  },
  {
    title: "강남 삼성동 위드 실내 테니스장",
    address: "서울 강남구 삼성로 566 빌딩엠 지하 1층",
    lat: 37.5121077,
    lng: 127.054283,
  },
  {
    title: "장충테니스장",
    address: "서울 중구 장충동2가 산14-68",
    lat: 37.5529076,
    lng: 127.000987,
  },
  {
    title: "연세탑테니스",
    address: "서울 노원구 한글비석로 325 B03호",
    lat: 37.6563791,
    lng: 127.077685,
  },
  {
    title: "레벨업테니스",
    address:
      "서울 동작구 보라매로5길 23 삼성옴니타워 지하1층106호~108호(남쪽)레벨업테니스",
    lat: 37.4925693,
    lng: 126.923608,
  },
  {
    title: "테니스하우스 잠실새내역",
    address: "서울 송파구 백제고분로9길 53 지하1층",
    lat: 37.5102339,
    lng: 127.084933,
  },
  {
    title: "이지테니스 신사점",
    address: "서울 강남구 논현로149길 67-5 B1층",
    lat: 37.5165774,
    lng: 127.023711,
  },
  {
    title: "스타테니스클럽",
    address: "서울 성동구 왕십리로 38 홍성빌딩 지하1층",
    lat: 37.5409437,
    lng: 127.044255,
  },
  {
    title: "파티오테니스",
    address: "서울 강남구 논현로 742 파티오나인 3층",
    lat: 37.5182341,
    lng: 127.028994,
  },
];

interface FormData {
  input: string;
}

const LocationForm = () => {
  const dispatch = useDispatch();

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5217305,
    lng: 126.976009,
  });

  const { register, getValues, handleSubmit } = useForm<FormData>();

  const handleLocationClick = (value: any) => {
    const { title, address, lat, lng } = value;
    if (
      window.confirm(
        `이 위치로 등록하시겠습니까?\n\n상호명 : ${title}\n주소 : ${address}`
      )
    ) {
      dispatch(
        submitLocation({
          title,
          address,
          lat,
          lng,
        })
      );
      dispatch(toggleLocation());
    }
  };

  const handleInputClick = async (e: any) => {
    const { input } = getValues();

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(input, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const lat = coords.getLat();
        const lng = coords.getLng();
        setCenter({ lat, lng });
      }
    });
  };

  return (
    <Overlay
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <LocationBox>
        <LocationBoxHeader>
          <span style={{ fontWeight: "600" }}>장소 등록</span>
          <span onClick={() => dispatch(toggleLocation())}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </LocationBoxHeader>
        <LocationMap>
          <Map
            center={{ lat: center.lat, lng: center.lng }}
            style={{ width: "1100px", height: "580px" }}
            level={7}
          >
            {locations.map((value, index) => (
              <MapMarker
                onClick={() => handleLocationClick(value)}
                key={index}
                position={{ lat: value.lat, lng: value.lng }}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 },
                }}
              />
            ))}
          </Map>
        </LocationMap>
        <Form onSubmit={handleSubmit(handleInputClick)}>
          <Input
            {...register("input", { required: true })}
            type="text"
            placeholder="위치를 입력하세요"
          />
        </Form>
      </LocationBox>
    </Overlay>
  );
};

export default LocationForm;
