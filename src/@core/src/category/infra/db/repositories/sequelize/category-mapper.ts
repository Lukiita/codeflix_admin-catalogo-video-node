import { Category } from '#category/domain';
import { EntityValidationError, LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { CategoryModel } from './category.model';

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    const {id, ...othersProps} = model.toJSON();
    try {
      return new Category(othersProps, new UniqueEntityId(id));
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }

      throw e;
    }
  }
}