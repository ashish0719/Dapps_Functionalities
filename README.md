# Metacrafters ATM DApp

Welcome to the Metacrafters ATM Decentralized Application! This project is built with Ethereum smart contracts, React, ethers.js, and CSS modules. Users can connect their MetaMask wallet, check their balance, and perform deposit and withdrawal transactions.

# Style.module.css

styling has been done through this file so that the all the containts including button paragraphs looks organized and well established

# extra functionalities that are added 
In the new implementation, the application has been enhanced to allow users to specify how much ETH they want to deposit or withdraw. This is done by adding input fields where users can enter the desired amounts. When they click the deposit or withdraw buttons, the specified amounts are used instead of a fixed value. This change provides users with more control and flexibility, making the application more user-friendly and functional. Additionally, a transaction history feature has been added to keep track of all deposit and withdrawal transactions.

State Variables:

Two new state variables, depositAmount and withdrawAmount, were added to store the user-defined amounts for deposit and withdrawal, respectively.
Another state variable, transactionHistory, was introduced to keep track of all transactions.

# Transaction History:

After each deposit or withdrawal transaction, an entry is added to the transactionHistory state variable, storing the transaction type, amount, and a timestamp.
