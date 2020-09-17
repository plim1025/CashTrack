// REACT //
import React from 'react';
import '../components/Landing/Landing.css';


// COMPONENTS //
import { css, StyleSheet } from 'aphrodite/no-important';

const Landing: React.FC = () => {
    return (
        <body>
            <div className="CashTrck">
                <a href="#" className="title">  CashTrack </a>
                <a href="#" className="SignIn"> Sign In </a>
            </div>
            <div className="LandTitle">
                <h2>
                    Banking Made Faster!
            </h2>
                <p> When you’re on top of your money, life is good. We help you
                effortlessly manage your finances in one place.
                </p>
                <button className="sign" id="spacing"> Sign Up For Free </button>
                <button className="sign" id="f"> Sign In </button>
            </div>
            <div className="content1">
                <div className="a">
                    <h3>All-in-one finances</h3>
                    <p> We bring all of your money to one place, from balances and bills to credit scores, etc.</p>
                    <ul className="f1">
                        <h1> [INSERT IMAGE HERE] </h1>
                        <h4> We bring together all of your accounts, bills and more,
                        so you can conveniently manage your finances from one dashboard.</h4>
                        <li>
                            See all of your bills and money at a glance
                        </li>
                        <li>
                            Create budgets easily with tips tailored to you
                        </li>
                        <li>
                            Enjoy access to unlimited free credit scores, without harming your credit
                        </li>
                    </ul>
                    <button className="sign"> Sign Up For Free </button>
                </div>
                <div className="b">
                    <h3>Budgets made simple</h3>
                    <p> Easily create budgets, and see our suggestions based on your spending.</p>
                    <ul className="f1">
                        <h1> [INSERT IMAGE HERE]</h1>
                        <h4> Bills are now easier than ever to track. Simply add them to your dashboard to see and monitor them all at once.</h4>
                        <li>
                            Receive reminders for upcoming bills so you can
                            plan ahead
                        </li>
                        <li>
                            Never miss a payment with alerts when bills are due
                        </li>
                        <li>
                            Get warned when funds are low so you know what you
                            can pay
                        </li>
                    </ul>
                    <button className="sign"> Learn More </button>
                </div>
                <div className="c">
                    <h3>Unlimited credit scores</h3>
                    <p> Check your free credit score as many times as you want with ease.</p>
                    <ul className="f1">
                        <h1> [INSERT IMAGE HERE] </h1>
                        <h4> We bring all of your money to one place, from balances and bills to credit score and more.</h4>
                        <li>
                            Sign in securely with your unique 4-digit code
                            and password
                        </li>
                        <li>

                            Remotely access and manage your account
                            from anywhere
                        </li>
                        <li>

                            Enjoy continuous protection with VeriSign
                            security scanning
                        </li>
                        <button className="sign"> Learn More </button>
                    </ul>


                </div>
            </div>
        </body>
    )
};

// STYLES //
const ss = StyleSheet.create({});

export default Landing;
