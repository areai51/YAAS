/**
 * GlobalEnvironment represents the variables that are replaced with actual values during build time with the project
 * build metadata.
 */
declare var GlobalEnvironment: {
	baseUrl: string;
	production: boolean;
	development: boolean;
	host: string;
	port: string;
	open: boolean;
	apiEndpoint: boolean;
	environment: string;
	gitInfo: {
		hash: string;
		currentBranch: string;
		tag: string;
		commitDate: string;
	}
};

interface WebpackModule {
	hot: {
		data?: any,
		idle: any,
		accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
		decline(dependencies?: string | string[]): void;
		dispose(callback?: (data?: any) => void): void;
		addDisposeHandler(callback?: (data?: any) => void): void;
		removeDisposeHandler(callback?: (data?: any) => void): void;
		check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
		apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
		status(callback?: (status?: string) => void): void | string;
		removeStatusHandler(callback?: (status?: string) => void): void;
	};
}

interface WebpackRequire {
	context(file: string, flag?: boolean, exp?: RegExp): any;
}


interface ErrorStackTraceLimit {
	stackTraceLimit: number;
}



// Extend typings
interface NodeRequire extends WebpackRequire { }
interface ErrorConstructor extends ErrorStackTraceLimit { }
interface NodeModule extends WebpackModule { }

declare namespace Reflect {
	function decorate(decorators: ClassDecorator[], target: Function): Function;
	function decorate(
		decorators: (PropertyDecorator | MethodDecorator)[],
		target: Object,
		targetKey: string | symbol,
		descriptor?: PropertyDescriptor): PropertyDescriptor;

	function metadata(metadataKey: any, metadataValue: any): {
		(target: Function): void;
		(target: Object, propertyKey: string | symbol): void;
	};
	function defineMetadata(metadataKey: any, metadataValue: any, target: Object): void;
	function defineMetadata(
		metadataKey: any,
		metadataValue: any,
		target: Object,
		targetKey: string | symbol): void;
	function hasMetadata(metadataKey: any, target: Object): boolean;
	function hasMetadata(metadataKey: any, target: Object, targetKey: string | symbol): boolean;
	function hasOwnMetadata(metadataKey: any, target: Object): boolean;
	function hasOwnMetadata(metadataKey: any, target: Object, targetKey: string | symbol): boolean;
	function getMetadata(metadataKey: any, target: Object): any;
	function getMetadata(metadataKey: any, target: Object, targetKey: string | symbol): any;
	function getOwnMetadata(metadataKey: any, target: Object): any;
	function getOwnMetadata(metadataKey: any, target: Object, targetKey: string | symbol): any;
	function getMetadataKeys(target: Object): any[];
	function getMetadataKeys(target: Object, targetKey: string | symbol): any[];
	function getOwnMetadataKeys(target: Object): any[];
	function getOwnMetadataKeys(target: Object, targetKey: string | symbol): any[];
	function deleteMetadata(metadataKey: any, target: Object): boolean;
	function deleteMetadata(metadataKey: any, target: Object, targetKey: string | symbol): boolean;
}


// We need this here since there is a problem with Zone.js typings
interface Thenable<T> {
	then<U>(
		onFulfilled?: (value: T) => U | Thenable<U>,
		onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
	then<U>(
		onFulfilled?: (value: T) => U | Thenable<U>,
		onRejected?: (error: any) => void): Thenable<U>;
	catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
}
