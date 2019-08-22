import axios from 'axios';
import Immutable from 'seamless-immutable';

const prefix = 'users';

const LOADING_USERS_START = `${prefix}/LOADING_USERS_START`;
const LOADING_USERS_SUCCEED = `${prefix}/LOADING_USERS_SUCCEED`;
const LOADING_USERS_FAILED = `${prefix}/LOADING_USERS_FAILED`;
const LOADING_USERS_CANCELED = `${prefix}/LOADING_USERS_CANCELED`;

const loadUsersStart = () => ({
  type: LOADING_USERS_START
});

const loadUsersSucceed = users => ({
  type: LOADING_USERS_SUCCEED,
  users,
  fetchedAt: Date.now()
});

const loadUsersFailed = error => ({
  type: LOADING_USERS_FAILED,
  error
});

// const loadUsersCanceled = () => ({
//   type: LOADING_USERS_CANCELED
// });

export const loadUsers = () => (dispatch, getState) => {
  dispatch(loadUsersStart());
  return axios
    .get('/api/admin/users/list')
    .then(response => {
      dispatch(loadUsersSucceed(response.data.users));
      dispatch(loadUsersSucceed(response.data.users));
    })
    .catch(error => {
      dispatch(loadUsersFailed(error.message));
    });
};

const initialState = Immutable({
  usersLoadingInProgress: false,
  usersLoadingError: '',
  usersLoadedAt: 0,
  list: []
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_USERS_START:
      return Immutable.merge(state, {
        usersLoadingInProgress: true,
        usersLoadingError: ''
      });

    case LOADING_USERS_SUCCEED:
      return Immutable.merge(state, {
        list: action.users,
        usersLoadedAt: action.fetchedAt,
        usersLoadingInProgress: false,
        usersLoadingError: ''
      });

    case LOADING_USERS_FAILED:
      return Immutable.merge(state, {
        usersLoadingInProgress: false,
        usersLoadingError: action.error
      });

    case LOADING_USERS_CANCELED:
      return Immutable.merge(state, {
        usersLoadingInProgress: false,
        usersLoadingError: action.error
      });
    default:
      return state;
  }
}
