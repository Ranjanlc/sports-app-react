const Card = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={props.color}
      stroke="#000"
      viewBox="0 0 24 24"
    >
      <g>
        <g>
          <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="0.36"
            d="M3 6.2v11.6c0 1.12 0 1.68.218 2.107.192.377.497.683.874.875.427.218.987.218 2.105.218h11.606c1.118 0 1.677 0 2.104-.218.377-.192.683-.498.875-.875.218-.427.218-.986.218-2.104V6.197c0-1.118 0-1.678-.218-2.105a2.001 2.001 0 00-.875-.874C19.48 3 18.92 3 17.8 3H6.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 00-.874.874C3 4.52 3 5.08 3 6.2z"
          ></path>
        </g>
      </g>
    </svg>
  );
};

export default Card;
