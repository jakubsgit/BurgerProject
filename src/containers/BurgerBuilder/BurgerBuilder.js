import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index'
import axios from '../../axios.orders';

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false,
    }

    componentDidMount() {
      console.log(this.props);
      this.props.onInitIngredients()
    }
    

     updatePurchaseState(ingredients) {
         const sum = Object.keys(ingredients)
             .map(igKey => {
                 return ingredients[igKey];
             })
             .reduce((sum, el) => {
                 return sum + el;
             }, 0);
             return sum > 0
    };
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});  
    // }
    // addIngredientHandler = type => {
    //     const updatedIngredients = { ...this.state.ingredients };
    //     updatedIngredients[type] = updatedIngredients[type] + 1;
    //     this.updatePurchaseState(updatedIngredients);
    //     this.setState((prevState, props) => {
    //       return {
    //         ingredients: updatedIngredients,
    //         totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type]
    //       };
    //     });
    //   };

    //   removeIngredientHandler = type => {
    //     if (this.state.ingredients[type] <= 0) {
    //       return;
    //     }
        
     
    //     const updatedIngredients = { ...this.state.ingredients };
    //     updatedIngredients[type] = updatedIngredients[type] - 1;
    //     this.updatePurchaseState(updatedIngredients);
    //     this.setState((prevState, props) => {
    //       return {
    //         ingredients: updatedIngredients,
    //         totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type],
    //       };
    //     });
    //   };

      purchaseHandler = () => {
        this.setState({purchasing: true});
      }

      purchaseCancelHandler = () => {
        this.setState({purchasing: false});
      }
      
      purchaseContinueHandler = () => {
      //   //alert('You wil be keep going!');
      //   this.setState({loading: true});
      //   const order = {
      //     ingredients: this.state.ingredients,
      //     price: this.state.totalPrice,
      //     customer: {
      //       name: 'Jakub Antczak',
      //       address: {
      //         street: 'Teststreet 1',
      //         zipCode: '65-001',
      //         country: 'Poland'
      //       },
      //       email: 'test@tesrt.com'
      //     },
      //     deliveryMethod: 'fastest'
      //   }
      //   axios.post('/orders.json', order)
      //     .then(response => {
      //       this.setState({loading: false, purchasing: false});
      //     })
      //     .catch(error => {
      //       this.setState({loading: false, purchasing: false});
      //     });
        // const queryParams = [];
        // for (let i in this.props.ings) {
        //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]));
        // }
        // queryParams.push('price=' + this.props.price)
        // const queryString = queryParams.join('&');

         this.props.history.push('/checkout');
      }

      render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded properly!</p> : <Spinner />;

        if ( this.props.ings ) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.props.prch}
                        ordered={this.purchaseHandler}
                        price={this.props.price} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
    prch: state.purchasable,
    error: state.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));