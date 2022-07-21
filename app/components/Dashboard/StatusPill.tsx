import React from 'react'
import styled from 'styled-components'

interface PillSpanProps {
    StatusType: 'Submitted' | 'Draft' | 'Withdrawn'
}

const PillSpan = styled.span<PillSpanProps>`
    background-color: ${props => {
        if(props.StatusType === 'Draft'){
            return 'rgba(96, 96, 96, 0.9);'
        }else if(props.StatusType === 'Withdrawn'){
            return `rgba(96, 96, 96, 0.1);`
        }else {
            return '#1A5A96;'
        }
    }}
    color: ${props => {
        if(props.StatusType === 'Withdrawn'){
            return 'rgba(45, 45, 45, 0.7);'
        }
        return '#FFFFFF;'
    }}
    border-radius: 4px;
    padding: 5px;
    text-transform: capitalize;
`


export default PillSpan