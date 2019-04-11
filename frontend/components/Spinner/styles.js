import styled from 'styled-components';
import { Box } from 'grommet';

export const PulseSpinner = styled(Box)`
  width: 40px;
  height: 40px;
  margin: 40px auto;
  background-color: #2f0dde;
  border-radius: 100%;
  -webkit-animation: pulseScaleOut 1s infinite ease-in-out;
          animation: pulseScaleOut 1s infinite ease-in-out;
@-webkit-keyframes pulseScaleOut {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0); }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 0; } }
@keyframes pulseScaleOut {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0); }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    opacity: 0; } }
`;

export const SquareSpinner = styled(Box)`
width: 40px;
height: 40px;
background-color: #2f0dde;
margin: 40px auto;
-webkit-animation: rotatePlane 1.2s infinite ease-in-out;
        animation: rotatePlane 1.2s infinite ease-in-out; }
@-webkit-keyframes rotatePlane {
0% {
  -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
          transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
50% {
  -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
          transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
100% {
  -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
          transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } }
@keyframes rotatePlane {
0% {
  -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
          transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
50% {
  -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
          transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
100% {
  -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
          transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } }

`;
