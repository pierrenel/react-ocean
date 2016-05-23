import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable';
import Base from '../Base';
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from './indexActions'
import AddTodo from '../../components/index/AddTodo'
import TodoList from '../../components/index/TodoList'
import Footer from '../../components/index/Footer'

class Page extends Base {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Injected by connect() call:
        const { dispatch, visibleTodos, visibilityFilter } = this.props
        return (
            <div>
                <AddTodo
                    onAddClick={text =>
                        dispatch(addTodo(text))
                    } />
                <TodoList
                    todos={visibleTodos}
                    onTodoClick={index =>
                        dispatch(completeTodo(index))
                    } />
                <Footer
                    filter={visibilityFilter}
                    onFilterChange={nextFilter =>
                        dispatch(setVisibilityFilter(nextFilter))
                    } />
            </div>
        )
    }
}

Page.propTypes = {
    visibleTodos: PropTypes.instanceOf(List).isRequired,
    visibilityFilter: PropTypes.oneOf([
        'SHOW_ALL',
        'SHOW_COMPLETED',
        'SHOW_ACTIVE'
    ]).isRequired
}

function selectTodos(todos, filter) {
    switch (filter) {
        case VisibilityFilters.SHOW_ALL:
            return todos
        case VisibilityFilters.SHOW_COMPLETED:
            return todos.filter(todo => todo.get('completed'))
        case VisibilityFilters.SHOW_ACTIVE:
            return todos.filter(todo => !todo.get('completed'))
    }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
    return {
        visibleTodos: selectTodos(state.get('todos'), state.get('visibilityFilter')),
        visibilityFilter: state.get('visibilityFilter')
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(Page);