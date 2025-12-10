import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { LanguagesModule } from './languages/languages.module';
import { LessonsModule } from './lessons/lessons.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ProgressModule } from './progress/progress.module';
import { MailModule } from './mail/mail.module';

const disableDb = process.env.DISABLE_DB === 'true';
const baseImports = [
  ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
];
const dbImports = [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    //ssl: { rejectUnauthorized: false },
  }),
  AuthModule,
  UsersModule,
  CategoriesModule,
  PostsModule,
  LanguagesModule,
  LessonsModule,
  ExercisesModule,
  ProgressModule,
];
const appImports = [...baseImports, ...(disableDb ? [] : dbImports), MailModule];

@Module({
  imports: appImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
