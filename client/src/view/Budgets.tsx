// /* eslint-disable react/jsx-one-expression-per-line */
// /* eslint-disable prettier/prettier */
// REACT //
import React, { useReducer, useContext, useEffect } from 'react';

// COMPONENTS //
import styled from 'styled-components';
import AddButton from '../components/Budgets/AddButton';
import BudgetModal from '../components/Budgets/BudgetModal';
import CategoryModals from '../components/shared/CategoryModals';
import BudgetList from '../components/Budgets/BudgetList';
import MonthCarousel from '../components/Budgets/MonthCarousel';

// CONTEXT //
import { ResourcesContext } from '../App';

// TYPES //
import { Transaction, Category, Budget } from '../types';

// UTILS //
import { createBudget } from '../components/shared/BudgetUtils';

type Actions =
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
    | { type: 'SET_CATEGORIES'; categories: Category[] }
    | { type: 'SET_BUDGETS'; budgets: Budget[] }
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
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
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
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.transactions };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.categories };
        case 'SET_BUDGETS':
            return { ...state, budgets: action.budgets };
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
    const { transactions, categories, budgets } = useContext(ResourcesContext);
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        transactions: transactions.read(),
        // eslint-disable-next-line prettier/prettier
        categories: [...categories.read(), { name: 'Bank Fees', type: 'expenses' }, { name: 'Legal Fees', type: 'expenses' }, { name: 'Charitable Giving', type: 'expenses' }, { name: 'Medical', type: 'expenses' }, { name: 'Cash', type: 'expenses' }, { name: 'Check', type: 'expenses' }, { name: 'Education', type: 'expenses' }, { name: 'Membership Fee', type: 'expenses' }, { name: 'Service', type: 'expenses' }, { name: 'Utilities', type: 'expenses' }, { name: 'Postage/Shipping', type: 'expenses' }, { name: 'Restaurant', type: 'expenses' }, { name: 'Entertainment', type: 'expenses' }, { name: 'Loan', type: 'expenses' }, { name: 'Rent', type: 'expenses' }, { name: 'Home Maintenance/Improvement', type: 'expenses' }, { name: 'Automotive', type: 'expenses' }, { name: 'Electronic', type: 'expenses' }, { name: 'Insurance', type: 'expenses' }, { name: 'Business Expenditure', type: 'expenses' }, { name: 'Real Estate', type: 'expenses' }, { name: 'Personal Care', type: 'expenses' }, { name: 'Gas', type: 'expenses' }, { name: 'Subscription', type: 'expenses' }, { name: 'Travel', type: 'expenses' }, { name: 'Shopping', type: 'expenses' }, { name: 'Clothing', type: 'expenses' }, { name: 'Groceries', type: 'expenses' }, { name: 'Tax', type: 'expenses' }, { name: 'Subsidy', type: 'income' }, { name: 'Interest', type: 'income' }, { name: 'Deposit', type: 'income' }, { name: 'Payroll/Salary', type: 'income' }, { name: 'Cash', type: 'income' }, { name: 'Transfer', type: 'other' }, { name: 'Investment', type: 'other' }, { name: 'Savings', type: 'other' }, { name: 'Retirement', type: 'other' }, { name: 'Uncategorized', type: 'other' }],
        budgets: budgets.read(),
        monthDate: new Date(),
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
        const budgetCategories = state.budgets.map(budget => budget.categoryName);
        const filteredDuplicateCategories = state.categories.map(category => ({
            ...category,
            selected: budgetCategories.indexOf(category.name) === -1,
        }));
        dispatch({ type: 'SET_CATEGORIES', categories: filteredDuplicateCategories });
    }, []);

    const handleCreateBudget = async (newBudget: Budget) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        const id = await createBudget(newBudget);
        const newBudgets = [...state.budgets, { ...newBudget, _id: id }];
        dispatch({ type: 'SET_BUDGETS', budgets: newBudgets });
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
            {/* <Title>Budgets for {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][state.monthDate.getMonth()]} {state.monthDate.getFullYear()}</Title> */}
            <BudgetList
                budgets={state.budgets}
                transactions={state.transactions}
                categories={state.categories}
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
                categories={state.categories.filter(category => category.selected)}
                handleCreateBudget={handleCreateBudget}
                monthDate={state.monthDate}
            />
            <CategoryModals
                setLoading={(loading: boolean) =>
                    dispatch({ type: 'SET_LOADING', loading: loading })
                }
                transactions={state.transactions}
                categories={state.categories}
                setTransactions={(newTransactions: Transaction[]) => {
                    dispatch({ type: 'SET_TRANSACTIONS', transactions: newTransactions });
                }}
                setCategories={(newCategories: Category[]) =>
                    dispatch({ type: 'SET_CATEGORIES', categories: newCategories })
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
