import React from 'react';

import { DataGrid } from '@mui/x-data-grid';

import formService from '../../services/formService';


/***
 * The response tab of the Manage Test page.
 * 
 * It lets the course instructor see different responses of the test and 
 * also the grades for each response
 */
function ResponseTab(props) {
  const [responseData, setResponseData] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);

  const [rows, setRows] = React.useState([]); //  the rows of the response table
  const [columns, setColumns] = React.useState([]); // the columns of the response table

  // get the selected options of a question, along with the correct options
  function getSelectedOption(questionId, questionIndex, studentIndex) {
    var oneResData = responseData[studentIndex];
    var selectedOp = oneResData.response.filter((qss) => qss.questionId === questionId);

    let optionName = '',
      correctAnswers = 0,
      actualCorrectAnswers = 0,
      flag = 0;

    if (selectedOp.length > 0) {
      questions[questionIndex].options.find((oo, index) => {
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

    questions[questionIndex].options.find((oo) => {
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

  // get the responses of all the students
  React.useEffect(() => {
    if (props.formData) {
      setQuestions(props.formData.questions);
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
          window.location.replace('/error');
        },
      );
    }
  }, [props.formId, props.formData]);

  // populate the response table once we get the responses of all the students
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

        // the marks are divided equally for all the correct options
        currRow.marks += (option.correctAnswers * question.marks) / option.actualCorrectAnswers;
      });
      currRow.marks = currRow.marks.toPrecision(2);
      rowsTemp.push(currRow);
    });

    setRows(rowsTemp);
    setColumns(columnsTemp);
  }, [responseData]);

  return (
    <div style={{ width: '100%' }}>
      <p> Responses</p>
      <DataGrid autoHeight rows={rows} columns={columns} />
    </div>
  );
}

export default ResponseTab;
