import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { init, reset } from './repositories/databaseRepository'
import { NavigationContainer } from '@react-navigation/native';
import StackRoot from './navigation/RecipeNavigation'
import { createStore, combineReducers } from 'redux';
import RecipeReducer from './store/reducers/RecipeReducer';
import UserReducer from './store/reducers/UserReducer';
import { Provider, useDispatch } from 'react-redux';
import CustomRecipeReducer from './store/reducers/CustomRecipe';
import { RECIPES } from './mockData/MockData';
import { insertRecipe } from './repositories/databaseRepository';
import Constants from 'expo-constants';
import { placeAllUnseenRecipesIntoState } from './store/actions/RecipeAction';

const store = createStore(combineReducers(
  {
    recipes: RecipeReducer,
    user: UserReducer,
    customRecipe: CustomRecipeReducer
  }));

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  const dispatch = useDispatch();

 
  const initializeDatabase = () => {
    if (Constants.manifest.web.reset) {
      reset().then(() => {
        console.log("Reset Table");
      }).catch(err => {
        console.log('Reset Failed');
        console.log(err);
      });
  
      init().then(() => {
        console.log("Initialize database");
      }).catch(err => {
        console.log('Initialize db failed');
        console.log(err);
      });
  
  
      for (const recipe of RECIPES) {
        insertRecipe(recipe.title, recipe.imageUri, recipe.webUri, 0)
          .then((response) => {
            dispatch(placeAllUnseenRecipesIntoState(response));
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackRoot></StackRoot>
      </NavigationContainer>
    </Provider>
  );
}

//#region Styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
//#endregion

