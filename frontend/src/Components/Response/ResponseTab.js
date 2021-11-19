import React from 'react';
import formService from '../../services/formService';

import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function ResponseTab(props) {
  const classes = useStyles();

  const [formData, setFormData] = React.useState({});
  const [responseData, setResponseData] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);

  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);

  function getSelectedOption(qId, i, j) {
    var oneResData = responseData[j];
    var selectedOp = oneResData.response.filter((qss) => qss.questionId === qId);

    let optionName = '',
      correctAnswers = 0,
      actualCorrectAnswers = 0,
      flag = 0;

    if (selectedOp.length > 0) {
      questions[i].options.find((oo, index) => {
        if (selectedOp[0].optionId.includes(oo._id)) {
          if (optionName) {
            optionName += ', ';
          }
          optionName += String.fromCharCode('A'.charCodeAt(0) + index);

          if (oo.isCorrect) {
            correctAnswers += 1;
          } else {
            flag = 1;
          }
        }
      });
    }

    questions[i].options.find((oo) => {
      if (oo.isCorrect) {
        actualCorrectAnswers += 1;
      }
    });

    if (!optionName) {
      optionName = '-';
    }

    if (flag === 1) {
      correctAnswers = 0;
    }

    return { optionName, correctAnswers, actualCorrectAnswers };
  }

  React.useEffect(() => {
    let columnsTemp = [
      { field: 'id', hide: true },
      { field: 'name', headerName: 'Name', width: 200 },
    ];
    let rowsTemp = [];
    console.log(questions);
    console.log(responseData);
    questions.forEach((question, id) => {
      id++;
      columnsTemp.push({
        field: question._id,
        headerName: 'Answer ' + id,
        width: 150,
      });
    });

    columnsTemp.push({
      field: 'marks',
      headerName: 'Total Marks',
      width: 200,
    });

    responseData.forEach((response, index) => {
      let currRow = {
        id: index + 1,
        marks: 0,
        name: response.user,
      };
      questions.forEach((question, qIndex) => {
        let option = getSelectedOption(question._id, qIndex, index);
        currRow[question._id] = option.optionName;
        currRow.marks += (option.correctAnswers * question.marks) / option.actualCorrectAnswers;
      });
      currRow.marks = currRow.marks.toPrecision(2);
      rowsTemp.push(currRow);
    });

    setRows(rowsTemp);
    setColumns(columnsTemp);
  }, [responseData]);

  React.useEffect(() => {
    if (props.formData) {
      setQuestions(props.formData.questions);
      setFormData(props.formData);
    }
    var formId = props.formId;
    if (formId !== undefined && formId !== '') {
      formService.getResponse(formId).then(
        (data) => {
          setResponseData(data);
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
        },
      );
    }
  }, [props.formId, props.formData]);

  return (
    <div style={{ width: '100%' }}>
      <p> Responses</p>
      <DataGrid autoHeight rows={rows} columns={columns} />
    </div>
  );
}
export default ResponseTab;
