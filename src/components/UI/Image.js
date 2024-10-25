import { useState } from 'react';
import dummyAvatar from '../../assets/matchDetail/dummy-avatar.png';
import dummyLogo from '../../assets/scoreList/dummy-logo.png';
function Image({ src, alt, isPlayer = false }) {
  const [error, setError] = useState(false);
  return (
    <>
      {!error && (
        <img
          src={src}
          alt={alt}
          onError={() => {
            setError(true);
          }}
        />
      )}
      {error && !isPlayer && <img src={dummyLogo} alt="dummy" />}
      {error && isPlayer && <img src={dummyAvatar} alt="dummy" />}
    </>
  );
}

export default Image;
