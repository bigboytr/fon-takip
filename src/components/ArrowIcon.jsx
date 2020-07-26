import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function ArrowIcon(props) {
    return (
        <span className={props.className}>
            <FontAwesomeIcon icon={props.indicator ? ['fas', 'arrow-up'] : ['fas', 'arrow-down']} />
        </span>
    )
}