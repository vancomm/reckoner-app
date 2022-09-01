import Container from "../Container";
import Carousel from "../Carousel";
import CrossIcon from "../CrossIcon";
import { Button } from "../Card";
import { useAppState } from "../../contexts/AppStateContext";
import { set } from "../../helpers/cacheHelper";
import image from "../../assets/images/i.png";
import manualText from "../../data/manual.json";
import styles from "./Manual.module.css";

export default function Manual() {
  const {
    uiState: { setShowManual },
  } = useAppState();

  return (
    <Container className={styles.manualContainer}>
      <div className={styles.manualControls}>
        <Button
          label="don't show again"
          className={styles.dontShowAgain}
          onClick={() => {
            setShowManual(false);
            set("showManual", false);
          }}
        />
        <Button onClick={() => setShowManual(false)}>
          <CrossIcon className={styles.dismissIcon} />
        </Button>
      </div>

      <span className={styles.title}>Hi!</span>

      <div className={styles.content}>
        <Carousel>
          <Carousel.Item id={`carousel-item-1`}>
            <span>{manualText.pages.pageOne}</span>
          </Carousel.Item>
          <Carousel.Item id={`carousel-item-2`}>
            <img src={image} alt="katakana equivalent of letter i" />
          </Carousel.Item>
        </Carousel>
      </div>
    </Container>
  );
}
