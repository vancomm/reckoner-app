import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useAppState } from "../../contexts/AppStateContext";

import Container from "../Container";
import Carousel from "../Carousel";
import CrossIcon from "../CrossIcon";
import Button from "../Button";

import { set } from "../../helpers/cacheHelper";
import pageOne from "../../data/manual-page-one.md";
import pageTwo from "../../data/manual-page-two.md";
import pageThree from "../../data/manual-page-three.md";
import pageFour from "../../data/manual-page-four.md";
import pageFive from "../../data/manual-page-five.md";
import styles from "./Manual.module.css";

export default function Manual() {
  const {
    uiState: { setShowManual },
  } = useAppState();

  const [ready, setReady] = useState(false);

  const [manualPageOne, setManualPageOne] = useState("");
  const [manualPageTwo, setManualPageTwo] = useState("");
  const [manualPageThree, setManualPageThree] = useState("");
  const [manualPageFour, setManualPageFour] = useState("");
  const [manualPageFive, setManualPageFive] = useState("");

  const loadPage = async (
    source: string,
    setPage: React.Dispatch<React.SetStateAction<string>>
  ) =>
    fetch(source)
      .then((res) => res.text())
      .then((value) => setPage(value));

  useEffect(() => {
    Promise.all([
      loadPage(pageOne, setManualPageOne),
      loadPage(pageTwo, setManualPageTwo),
      loadPage(pageThree, setManualPageThree),
      loadPage(pageFour, setManualPageFour),
      loadPage(pageFive, setManualPageFive),
    ]).then(() => setReady(true));
  }, []);

  return (
    <Container
      className={styles.manualContainer}
      style={ready ? undefined : { display: "none" }}
    >
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

      <div className={styles.content}>
        <Carousel>
          {manualPageOne.trim() && (
            <Carousel.Item id={`carousel-item-1`}>
              <ReactMarkdown className={styles.markdown}>
                {manualPageOne}
              </ReactMarkdown>
            </Carousel.Item>
          )}
          {manualPageTwo.trim() && (
            <Carousel.Item id={`carousel-item-2`}>
              <ReactMarkdown className={styles.markdown}>
                {manualPageTwo}
              </ReactMarkdown>
            </Carousel.Item>
          )}
          {manualPageThree.trim() && (
            <Carousel.Item id={`carousel-item-3`}>
              <ReactMarkdown className={styles.markdown}>
                {manualPageThree}
              </ReactMarkdown>
            </Carousel.Item>
          )}
          {manualPageFour.trim() && (
            <Carousel.Item id={`carousel-item-4`}>
              <ReactMarkdown className={styles.markdown}>
                {manualPageFour}
              </ReactMarkdown>
            </Carousel.Item>
          )}
          {manualPageFive.trim() && (
            <Carousel.Item id={`carousel-item-5`}>
              <ReactMarkdown className={styles.markdown}>
                {manualPageFive}
              </ReactMarkdown>
            </Carousel.Item>
          )}
        </Carousel>
      </div>
    </Container>
  );
}
