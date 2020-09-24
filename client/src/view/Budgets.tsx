/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable prettier/prettier */
// REACT //
import React, { useReducer, useContext, useEffect } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import AddButton from '../components/Budgets/AddButton';
import BudgetModal from '../components/Budgets/BudgetModal';
import CategoryModals from '../components/shared/CategoryModals';
import BudgetList from '../components/Budgets/BudgetList';
import MonthCarousel from '../components/Budgets/MonthCarousel';
import FallbackSpinner from '../components/shared/FallbackSpinner';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Category, Budget } from '../types';

// UTILS //
import { createBudget, updateBudget, deleteBudget } from '../components/shared/BudgetUtils';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_MONTH_DATE'; date: Date }
    | { type: 'SHOW_BUDGET_ADD_MODAL' }
    | { type: 'SHOW_BUDGET_EDIT_MODAL'; budget: Budget }
    | { type: 'HIDE_BUDGET_MODAL' }
    | { type: 'SHOW_CATEGORY_MODAL' }
    | { type: 'HIDE_CATEGORY_MODAL' }
    | { type: 'SHOW_CATEGORY_SUBMODAL'; mode: string; category: Category }
    | { type: 'HIDE_CATEGORY_SUBMODAL' }
    | { type: 'SHOW_CATEGORY_DELETE_MODAL' }
    | { type: 'HIDE_CATEGORY_DELETE_MODAL' };

interface ReducerState {
    loading: boolean;
    monthDate: Date;
    budgetModal: {
        show: boolean;
        mode: string;
        budget: Budget;
    };
    categoryModal: boolean;
    categorySubmodal: {
        show: boolean;
        mode: string;
        category: Category;
    };
    categoryDeleteModal: boolean;
}

const reducer = (state: ReducerState, action: Actions) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.loading };
        case 'SET_MONTH_DATE':
            return { ...state, monthDate: action.date };
        case 'SHOW_BUDGET_ADD_MODAL':
            return { ...state, budgetModal: { ...state.budgetModal, show: true, mode: 'add' } };
        case 'SHOW_BUDGET_EDIT_MODAL':
            return { ...state, budgetModal: { show: true, mode: 'edit', budget: action.budget } };
        case 'HIDE_BUDGET_MODAL':
            return { ...state, budgetModal: { ...state.budgetModal, show: false } };
        case 'SHOW_CATEGORY_MODAL':
            return { ...state, categoryModal: true };
        case 'HIDE_CATEGORY_MODAL':
            return { ...state, categoryModal: false };
        case 'SHOW_CATEGORY_SUBMODAL':
            return {
                ...state,
                categoryModal: false,
                categorySubmodal: {
                    show: true,
                    mode: action.mode,
                    category: action.category,
                },
            };
        case 'HIDE_CATEGORY_SUBMODAL':
            return {
                ...state,
                categoryModal: true,
                categorySubmodal: { ...state.categorySubmodal, show: false },
            };
        case 'SHOW_CATEGORY_DELETE_MODAL':
            return {
                ...state,
                categoryDeleteModal: true,
                categorySubmodal: { ...state.categorySubmodal, show: false },
            };
        case 'HIDE_CATEGORY_DELETE_MODAL':
            return {
                ...state,
                categoryDeleteModal: false,
                categoryModal: true,
            };
        default:
            return state;
    }
};

const Budgets: React.FC = () => {
    const { transactions, categories, setCategories, budgets, setBudgets } = useContext(
        ResourcesContext
    );

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        monthDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        budgetModal: {
            show: false,
            mode: '',
            budget: null,
        },
        categoryModal: false,
        categorySubmodal: {
            show: false,
            mode: 'add',
            category: null,
        },
        categoryDeleteModal: false,
    });

    useEffect(() => {
        const budgetCategories = budgets.map(budget => budget.categoryName);
        const filteredDuplicateCategories = categories.map(category => ({
            ...category,
            selected: budgetCategories.indexOf(category.name) === -1,
        }));
        setCategories(filteredDuplicateCategories);
    }, [budgets]);

    const handleCreateBudget = async (newBudget: Budget) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        const createdBudget = await createBudget(newBudget);
        const newBudgets = [...budgets, createdBudget];
        setBudgets(newBudgets);
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    const handleEditBudget = async (budgetID: string, newBudget: Budget) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        const updatedBudget = await updateBudget(budgetID, newBudget);
        const newBudgets = [...budgets.filter(budget => budget._id !== budgetID), updatedBudget];
        setBudgets(newBudgets);
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    const handleDeleteBudget = async (budgetID: string) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        await deleteBudget(budgetID);
        const newBudgets = budgets.filter(budget => budget._id !== budgetID);
        setBudgets(newBudgets);
        dispatch({ type: 'SET_LOADING', loading: false });
    };

    return (
        <Wrapper>
            <SubWrapper>
                <AddButton openAddModal={() => dispatch({ type: 'SHOW_BUDGET_ADD_MODAL' })} />
                <MonthCarousel
                    monthDate={state.monthDate}
                    setMonthDate={(monthDate: Date) =>
                        dispatch({ type: 'SET_MONTH_DATE', date: monthDate })
                    }
                />
            </SubWrapper>
            <Title>Budgets for {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][state.monthDate.getMonth()]} {state.monthDate.getFullYear()}</Title>
            <BudgetList
                budgets={budgets.filter(
                    budget =>
                        new Date(budget.startDate) <= state.monthDate &&
                        new Date(budget.endDate) > state.monthDate
                )}
                transactions={transactions}
                categories={categories}
                monthDate={state.monthDate}
                openEditModal={(newBudget: Budget) =>
                    dispatch({ type: 'SHOW_BUDGET_EDIT_MODAL', budget: newBudget })
                }
            />
            <BudgetModal
                show={state.budgetModal.show}
                mode={state.budgetModal.mode}
                budget={state.budgetModal.budget}
                close={() => dispatch({ type: 'HIDE_BUDGET_MODAL' })}
                openCategory={() => dispatch({ type: 'SHOW_CATEGORY_MODAL' })}
                categories={categories.filter(category => category.selected)}
                monthDate={state.monthDate}
                handleCreateBudget={handleCreateBudget}
                handleEditBudget={handleEditBudget}
                handleDeleteBudget={handleDeleteBudget}
            />
            <CategoryModals
                setLoading={(loading: boolean) =>
                    dispatch({ type: 'SET_LOADING', loading: loading })
                }
                categoryModal={state.categoryModal}
                categorySubmodal={state.categorySubmodal}
                categoryDeleteModal={state.categoryDeleteModal}
                openCategorySubmodal={(mode: string, category?: Category) =>
                    dispatch({
                        type: 'SHOW_CATEGORY_SUBMODAL',
                        mode: mode,
                        category: category,
                    })
                }
                openCategoryDeleteModal={() => dispatch({ type: 'SHOW_CATEGORY_DELETE_MODAL' })}
                hideCategoryModal={() => dispatch({ type: 'HIDE_CATEGORY_MODAL' })}
                hideCategorySubmodal={() => dispatch({ type: 'HIDE_CATEGORY_SUBMODAL' })}
                hideCategoryDeleteModal={() => dispatch({ type: 'HIDE_CATEGORY_DELETE_MODAL' })}
            />
            <FallbackSpinner backdrop show={state.loading} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const SubWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;
    max-width: 800px;
    width: 100%;
`;

const Title = styled.div`
    font-size: 1.25rem;
    font-weight: 700;
`;

export default Budgets;
