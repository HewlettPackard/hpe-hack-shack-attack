/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */

import styled from 'styled-components';

export const TableLayout = styled.div`
width: 100%;
background-color: black;
  table {
    box-sizing: border-box;
    max-width: 90%;
    overflow: auto;
    margin: 24px 0;
    color: initial;
    padding: 12px;
    margin-bottom: 0;
    width: 90%;
    font-family: fantasy;

    tr {
      
    }

    thead th {
      font-weight: 600;
      font-size: 300%;
      color: purple;
    }

    td {
      padding: 0.5rem;
      text-align: center;
      color: white;
    }
  }

`;

export default TableLayout;
