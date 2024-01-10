const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { v4: uuidv4, validate: validateUuid } = require('uuid');

router.post('/', async (req, res, next) => {
    try {
        let { username, age, hobbies } = req.body;
        if (!username || !age || !hobbies) {
            return res.status(400).send({ message: "Sorry! your request body is invalid!" });
        }
        await User.create({
            id: uuidv4(),
            username,
            age,
            hobbies
        });
        return res.status(201).send({ message: "Congrats! User added successfully..!" })
    } catch (e) {
        return res.status(500).send({ message: "Oops something went wrong..!" });
    }
})

router.get('/:userId', async (req, res, next) => {
    try {
        let id = req.params.userId;
        if (id && validateUuid(id)) {
            let user_data = await User.findOne({ id }).lean();
            if (user_data)
                return res.status(200).send({ data: user_data });
            else
                return res.status(404).send({ message: "Sorry! user not found..!" });
        } else {
            return res.status(400).send({ message: "Invalid params" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Oops something went wrong..!" });
    }
});

router.get('/', async (req, res, next) => {
    try {
        let user_data = await User.find({}).lean();
        return res.status(200).send({ data: user_data });
    } catch (e) {
        return res.status(500).send({ message: "Oops something went wrong..!" });
    }
});

router.put('/:userId', async (req, res, next) => {
    try {
        let id = req.params.userId;
        let { age, username, hobbies } = req.body;
        let obj = {};
        if (age)
            obj = { age }
        if (username)
            obj = { ...obj, username }
        if (hobbies)
            obj = { ...obj, hobbies }
        if (id && validateUuid(id)) {
            let user_data = await User.findOne({ id }).lean();
            if (user_data) {
                await User.updateOne(
                    { id },
                    { $set: { ...obj } }
                );
                return res.status(200).send({ message: "User updated successfully..!" });
            }
            else
                return res.status(404).send({ message: "Sorry! User not found..!" });
        } else {
            return res.status(400).send({ message: "Invalid params" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Oops something went wrong..!" });
    }
});

router.delete('/:userId', async (req, res, next) => {
    try {
        let id = req.params.userId;
        if (id && validateUuid(id)) {
            let user_data = await User.findOne({ id }).lean();
            if (user_data) {
                await User.deleteOne(
                    { id }
                );
                return res.status(200).send({ message: "User deleted successfully..!" });
            }
            else
                return res.status(404).send({ message: "Sorry! User not found..!" });
        } else {
            return res.status(400).send({ message: "Invalid params" });
        }
    } catch (e) {
        return res.status(500).send({ message: "Oops something went wrong..!" });
    }
})
module.exports = router;