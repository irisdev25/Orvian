const Category = require('../models/Category');

class CategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAllByUser(req.user.id);
            res.render('pages/categories', { 
                title: 'Categorias', 
                page: 'categories', 
                categories 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar categorias');
        }
    }

    static async createCategory(req, res) {
        try {
            const { name, color } = req.body;
            await Category.create({ 
                name, 
                color, 
                user_id: req.user.id 
            });
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear categoria');
        }
    }

    static async deleteCategory(req, res) {
        try {
            await Category.delete(req.params.id);
            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar categoria');
        }
    }
}

module.exports = CategoryController;
