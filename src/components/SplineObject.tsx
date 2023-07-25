import { Suspense, useEffect, useState } from "react";
import Spline from '@splinetool/react-spline';

const SplineObj = (props: { scene: string; }) => {
  const [isDesktop, setDesktop] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 550) {
      setDesktop(true);
    } else {
      setDesktop(false);
    }

    const updateMedia = () => {
      if (window.innerWidth > 550) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);
  return (
    <Suspense fallback={<>Loading...</>}>
      {isDesktop&&<Spline className="" scene={props.scene} />}
    </Suspense>
  );
};

Spline.propTypes = {};

export default SplineObj;