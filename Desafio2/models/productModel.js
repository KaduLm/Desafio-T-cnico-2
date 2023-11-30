const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Insira seu nome"]
        },

        email: {
            type: String,
            required: [true, "Insira seu email"]
        },

        password: {
            type: String,
            required: [true, "Insira sua senha"]
          },

        telefone: {
            numero: {
                type: String,
                required: [true, "Insira seu telefone"]
            },
            ddd: {
                type: String,
                required: [true, "Insira seu DDD"]
            }
        }
    },

    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
