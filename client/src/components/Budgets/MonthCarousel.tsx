/* eslint-disable react/jsx-one-expression-per-line */
// REACT //
import React from 'react';

// COMPONENTS //
import styled from 'styled-components';

interface Props {
    monthDate: Date;
    setMonthDate: (monthDate: Date) => void;
}

const MonthCarousel: React.FC<Props> = props => {
    const handleSelectMonth = (index: number) => {
        const newMonthDate = new Date(props.monthDate.getFullYear(), index + 1, 0);
        props.setMonthDate(newMonthDate);
    };

    return (
        <Wrapper>
            {[
                'JAN',
                'FEB',
                'MAR',
                'APR',
                'MAY',
                'JUN',
                'JUL',
                'AUG',
                'SEP',
                'OCT',
                'NOV',
                'DEC',
            ].map((month, index) => (
                <MonthWrapper key={month} onClick={() => handleSelectMonth(index)}>
                    <MonthBox selected={props.monthDate.getMonth() === index} />
                    <MonthText>{month}</MonthText>
                </MonthWrapper>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    margin: 10px auto;
    max-width: 600px;
    width: calc(100% - 40px);
`;

const MonthWrapper = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin: 0 1px;
    width: 8.3%;
`;
const MonthBox = styled(({ selected, ...rest }) => <div {...rest} />)<{ selected: boolean }>`
    background: ${({ selected }) => (selected ? '#007bff' : '#6c757d')};
    border-radius: 4px;
    height: 20px;
    width: 100%;
`;

const MonthText = styled.div`
    font-size: 12px;
`;

export default MonthCarousel;
