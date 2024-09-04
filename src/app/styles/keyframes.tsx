import { keyframes } from "@chakra-ui/react";

export const flyAcross = keyframes`
  0% {
    left: -50px;
    transform: rotate(0deg);
  }
  100% {
    left: calc(100% + 50px);
    transform: rotate(720deg);
  }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;