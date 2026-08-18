import axios from 'axios';
import Immutable from 'seamless-immutable';

const prefix = 'categories_for_admin';

const LOADING_CATEGORIES_START = `${prefix}/LOADING_CATEGORIES_START`;
const LOADING_CATEGORIES_SUCCEED = `${prefix}/LOADING_CATEGORIES_SUCCEED`;
const LOADING_CATEGORIES_FAILED = `${prefix}/LOADING_CATEGORIES_FAILED`;

const LOADING_CATEGORY_START = `${prefix}/LOADING_CATEGORY_START`;
const LOADING_CATEGORY_SUCCEED = `${prefix}/LOADING_CATEGORY_SUCCEED`;
const LOADING_CATEGORY_FAILED = `${prefix}/LOADING_CATEGORY_FAILED`;

const CREATING_CATEGORY_START = `${prefix}/CREATING_CATEGORY_START`;
const CREATING_CATEGORY_SUCCEED = `${prefix}/CREATING_CATEGORY_SUCCEED`;
const CREATING_CATEGORY_FAILED = `${prefix}/CREATING_CATEGORY_FAILED`;

const CATEGORY_DEMOLITION_START = `${prefix}/CATEGORY_DEMOLITION_START`;
const CATEGORY_DEMOLITION_SUCCEED = `${prefix}/CATEGORY_DEMOLITION_SUCCEED`;
const CATEGORY_DEMOLITION_FAILED = `${prefix}/CATEGORY_DEMOLITION_FAILED`;

// Loading

const loadCategoriesStart = () => ({
  type: LOADING_CATEGORIES_START
});

const loadCategoriesSucceed = categories => ({
  type: LOADING_CATEGORIES_SUCCEED,
  categories,
  fetchedAt: Date.now()
});

const loadCategoriesFailed = error => ({
  type: LOADING_CATEGORIES_FAILED,
  error
});

// Creation

const createCategoryStart = () => ({
  type: CREATING_CATEGORY_START
});

const createCategorySucceed = category => ({
  type: CREATING_CATEGORY_SUCCEED,
  category,
  fetchedAt: Date.now()
});

const createCategoryFailed = error => ({
  type: CREATING_CATEGORY_FAILED,
  error
});

// Loading SINGLE

const loadCategoryStart = () => ({
  type: LOADING_CATEGORY_START
});

const loadCategorySucceed = category => ({
  type: LOADING_CATEGORY_SUCCEED,
  category,
  fetchedAt: Date.now()
});

const loadCategoryFailed = error => ({
  type: LOADING_CATEGORY_FAILED,
  error
});

// Category Demolition

const categoryDemolitionStart = () => ({
  type: CATEGORY_DEMOLITION_START
});

const categoryDemolitionSucceed = humanId => ({
  type: CATEGORY_DEMOLITION_SUCCEED,
  humanId,
  fetchedAt: Date.now()
});

const categoryDemolitionFailed = error => ({
  type: CATEGORY_DEMOLITION_FAILED,
  error
});

export const loadCategory = humanId => (dispatch, getState) => {
  dispatch(loadCategoryStart());
  return axios
    .get(`/api/admin/categories/create/${humanId}`)
    .then(response => {
      dispatch(loadCategorySucceed(response.data.loadedCategory));
    })
    .catch(error => {
      dispatch(loadCategoryFailed(error.message));
    });
};

export const loadCategories = () => (dispatch, getState) => {
  dispatch(loadCategoriesStart());
  return axios
    .get('/api/admin/categories/list')
    .then(response => {
      dispatch(loadCategoriesSucceed(response.data.categories));
    })
    .catch(error => {
      dispatch(loadCategoriesFailed(error.message));
    });
};

export const deleteCategory = humanId => (dispatch, getState) => {
  dispatch(categoryDemolitionStart());
  return axios
    .post(`/api/admin/categories/delete/${humanId}`)
    .then(response => {
      dispatch(categoryDemolitionSucceed(humanId));
    })
    .catch(error => {
      dispatch(categoryDemolitionFailed(error.message));
    });
};

export const createCategory = ({ bigPic, ...values }) => (
  dispatch,
  getState
) => {
  dispatch(createCategoryStart());
  let formData = new FormData();

  for (var key in values) {
    formData.append(key, values[key]);
  }
  if (bigPic) {
    for (var i = 0; i < bigPic.length; i++) {
      formData.append('bigPic', bigPic[i], bigPic[i].name);
    }
  }
  return axios
    .post('/api/admin/categories/create', formData)
    .then(response => {
      dispatch(createCategorySucceed(response.data.category));
      return response.data;
    })
    .catch(error => {
      dispatch(createCategoryFailed(error.message));
    });
};

const initialState = Immutable({
  categoriesLoadingInProgress: false,
  categoriesLoadingError: '',
  categoriesLoadedAt: 0,
  categoryLoadingInProgress: false,
  categoryLoadingError: '',
  categoryLoadedAt: 0,
  categoryCreationInProgress: false,
  categoryCreationError: '',
  categoryCreatedAt: 0,
  categoryDemolitionInProgress: false,
  categoryDemolitionError: '',
  categoryDemolitedAt: 0,
  loadedCategory: false,
  list: []
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_CATEGORIES_START:
      return Immutable.merge(state, {
        categoriesLoadingInProgress: true,
        categoriesLoadingError: ''
      });

    case LOADING_CATEGORIES_SUCCEED:
      return Immutable.merge(state, {
        list: action.categories,
        categoriesLoadedAt: action.fetchedAt,
        categoriesLoadingInProgress: false,
        categoriesLoadingError: ''
      });

    case LOADING_CATEGORIES_FAILED:
      return Immutable.merge(state, {
        categoriesLoadingInProgress: false,
        categoriesLoadingError: action.error
      });

    case CREATING_CATEGORY_START:
      return Immutable.merge(state, {
        categoryCreationInProgress: true,
        categoryCreationError: ''
      });

    case CREATING_CATEGORY_SUCCEED:
      return Immutable.merge(state, {
        categoryCreatedAt: action.fetchedAt,
        categoryCreationInProgress: false,
        categoryCreationError: ''
      });

    case CREATING_CATEGORY_FAILED:
      return Immutable.merge(state, {
        categoryCreationInProgress: false,
        categoryCreationError: action.error
      });

    case LOADING_CATEGORY_START:
      return Immutable.merge(state, {
        categoryLoadingInProgress: true,
        categoryLoadingError: ''
      });

    case LOADING_CATEGORY_SUCCEED:
      return Immutable.merge(state, {
        loadedGame: action.category,
        categoryLoadedAt: action.fetchedAt,
        categoryLoadingInProgress: false,
        categoryLoadingError: ''
      });

    case LOADING_CATEGORY_FAILED:
      return Immutable.merge(state, {
        categoryLoadingInProgress: false,
        categoryLoadingError: action.error
      });

    case CATEGORY_DEMOLITION_START:
      return Immutable.merge(state, {
        categoryDemolitionInProgress: true,
        categoryDemolitionError: ''
      });

    case CATEGORY_DEMOLITION_SUCCEED:
      const categories = [...state.list.asMutable()];
      return Immutable.merge(state, {
        categoryDemolitionInProgress: false,
        list: Immutable(categories.filter(g => g.humanId !== action.humanId))
      });

    case CATEGORY_DEMOLITION_FAILED:
      return Immutable.merge(state, {
        categoryDemolitionInProgress: false,
        categoryDemolitionError: action.error
      });

    default:
      return state;
  }
}
