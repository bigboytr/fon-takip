import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col} from "reactstrap";
import ArrowIcon from "./ArrowIcon";

export default function BigNumbers(props) {


  const { amount, title, textColor, showArrow, profitLoss } = props;
  return (
    <>
      <h3 className={`mb-0 mt-4 ${textColor}`}>
        {amount}
        {showArrow
          ? <ArrowIcon isProfit={profitLoss}/>
          : null
        }
      </h3>
      <h6 className="text-muted">{title}</h6>


    </>
  )
}