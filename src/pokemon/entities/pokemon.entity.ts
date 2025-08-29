import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  namePokemon: string;

  @Prop({
    unique: true,
    index: true,
  })
  numberPokemon: string;
}

export const pokemonSchema = SchemaFactory.createForClass(Pokemon);
