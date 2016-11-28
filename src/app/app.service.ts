export class AppService {
    title: string = 'Hello, world!';
    description: string = 'from YAAS (Yet Another Angular2 Starter-kit), with Webpack + Typescript + Karma + SASS';

    public getTitle(): string {
        return this.title;
    }
    public getDescription(): string {
        return this.description;
    }
}
