/* export const productValidator = (req, res, next) => {
    const product = req.body;
    if (product.price === "" || product.price === undefined || typeof product.price !== 'number'){
      res.status(404).send('El precio debe ser ingresado en números!');
      return;
    }
    if (product.stock === "" || product.stock === undefined || typeof product.stock !== 'number'){
      res.status(404).send('El stock debe ser ingresado en números!');
      return;
    }
    if (product.code === "" || product.code === undefined || typeof product.code !== 'number'){
        res.status(404).send('El code debe ser ingresado en números!');
        return;
      }
    if (product.title === "" || product.title === undefined || typeof product.title !== 'string'){
      res.status(404).send('El título no puede estar vacío y debe ser un string!');
      return;
    }
    if (typeof product.description !== 'string'){
      res.status(404).send('La descripción debe ser un string!');
      return;
    }
    if (typeof product.status !== 'boolean'){
        res.status(404).send('El status debe ser un booleano!');
        return;
      }
    next();
  }
   */