<?php
/* @noinspection ALL */
// @formatter:off
// phpcs:ignoreFile

/**
 * A helper file for Laravel, to provide autocomplete information to your IDE
 * Generated for Laravel 12.12.0.
 *
 * This file should not be included in your code, only analyzed by your IDE!
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 * @see https://github.com/barryvdh/laravel-ide-helper
 */
namespace Nwidart\Modules\Facades {
    /**
     * 
     *
     * @method static array getCached()
     */
    class Module {
        /**
         * Add other module location.
         *
         * @static 
         */
        public static function addLocation($path)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->addLocation($path);
        }

        /**
         * Get all additional paths.
         *
         * @static 
         */
        public static function getPaths()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getPaths();
        }

        /**
         * Get scanned modules paths.
         *
         * @static 
         */
        public static function getScanPaths()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getScanPaths();
        }

        /**
         * Get & scan all modules.
         *
         * @static 
         */
        public static function scan()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->scan();
        }

        /**
         * Get all modules.
         *
         * @static 
         */
        public static function all()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->all();
        }

        /**
         * Get all modules as collection instance.
         *
         * @static 
         */
        public static function toCollection()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->toCollection();
        }

        /**
         * Get modules by status.
         *
         * @static 
         */
        public static function getByStatus($status)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getByStatus($status);
        }

        /**
         * Determine whether the given module exist.
         *
         * @static 
         */
        public static function has($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->has($name);
        }

        /**
         * Get list of enabled modules.
         *
         * @static 
         */
        public static function allEnabled()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->allEnabled();
        }

        /**
         * Get list of disabled modules.
         *
         * @static 
         */
        public static function allDisabled()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->allDisabled();
        }

        /**
         * Get count from all modules.
         *
         * @static 
         */
        public static function count()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->count();
        }

        /**
         * Get all ordered modules.
         *
         * @static 
         */
        public static function getOrdered($direction = 'asc')
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getOrdered($direction);
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function getPath()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getPath();
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function register()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->register();
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function boot()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->boot();
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function find($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->find($name);
        }

        /**
         * Find a specific module, if there return that, otherwise throw exception.
         *
         * @throws ModuleNotFoundException
         * @static 
         */
        public static function findOrFail($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->findOrFail($name);
        }

        /**
         * Get all modules as laravel collection instance.
         *
         * @static 
         */
        public static function collections($status = 1)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->collections($status);
        }

        /**
         * Get module path for a specific module.
         *
         * @static 
         */
        public static function getModulePath($module)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getModulePath($module);
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function assetPath($module)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->assetPath($module);
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function config($key, $default = null)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->config($key, $default);
        }

        /**
         * Get storage path for module used.
         *
         * @static 
         */
        public static function getUsedStoragePath()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getUsedStoragePath();
        }

        /**
         * Set module used for cli session.
         *
         * @throws ModuleNotFoundException
         * @static 
         */
        public static function setUsed($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->setUsed($name);
        }

        /**
         * Forget the module used for cli session.
         *
         * @static 
         */
        public static function forgetUsed()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->forgetUsed();
        }

        /**
         * Get module used for cli session.
         *
         * @throws \Nwidart\Modules\Exceptions\ModuleNotFoundException
         * @static 
         */
        public static function getUsedNow()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getUsedNow();
        }

        /**
         * Get laravel filesystem instance.
         *
         * @static 
         */
        public static function getFiles()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getFiles();
        }

        /**
         * Get module assets path.
         *
         * @static 
         */
        public static function getAssetsPath()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getAssetsPath();
        }

        /**
         * Get asset url from a specific module.
         *
         * @throws InvalidAssetPath
         * @static 
         */
        public static function asset($asset)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->asset($asset);
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function isEnabled($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->isEnabled($name);
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function isDisabled($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->isDisabled($name);
        }

        /**
         * Enabling a specific module.
         *
         * @throws \Nwidart\Modules\Exceptions\ModuleNotFoundException
         * @static 
         */
        public static function enable($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->enable($name);
        }

        /**
         * Disabling a specific module.
         *
         * @throws \Nwidart\Modules\Exceptions\ModuleNotFoundException
         * @static 
         */
        public static function disable($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->disable($name);
        }

        /**
         * {@inheritDoc}
         *
         * @static 
         */
        public static function delete($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->delete($name);
        }

        /**
         * Update dependencies for the specified module.
         *
         * @static 
         */
        public static function update($module)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->update($module);
        }

        /**
         * Install the specified module.
         *
         * @static 
         */
        public static function install($name, $version = 'dev-master', $type = 'composer', $subtree = false)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->install($name, $version, $type, $subtree);
        }

        /**
         * Get stub path.
         *
         * @static 
         */
        public static function getStubPath()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->getStubPath();
        }

        /**
         * Set stub path.
         *
         * @static 
         */
        public static function setStubPath($stubPath)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->setStubPath($stubPath);
        }

        /**
         * 
         *
         * @static 
         */
        public static function resetModules()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            /** @var \Nwidart\Modules\Laravel\LaravelFileRepository $instance */
            return $instance->resetModules();
        }

        /**
         * Register a custom macro.
         *
         * @param string $name
         * @param object|callable $macro
         * @param-closure-this static  $macro
         * @return void 
         * @static 
         */
        public static function macro($name, $macro)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            \Nwidart\Modules\Laravel\LaravelFileRepository::macro($name, $macro);
        }

        /**
         * Mix another object into the class.
         *
         * @param object $mixin
         * @param bool $replace
         * @return void 
         * @throws \ReflectionException
         * @static 
         */
        public static function mixin($mixin, $replace = true)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            \Nwidart\Modules\Laravel\LaravelFileRepository::mixin($mixin, $replace);
        }

        /**
         * Checks if macro is registered.
         *
         * @param string $name
         * @return bool 
         * @static 
         */
        public static function hasMacro($name)
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            return \Nwidart\Modules\Laravel\LaravelFileRepository::hasMacro($name);
        }

        /**
         * Flush the existing macros.
         *
         * @return void 
         * @static 
         */
        public static function flushMacros()
        {
            //Method inherited from \Nwidart\Modules\FileRepository 
            \Nwidart\Modules\Laravel\LaravelFileRepository::flushMacros();
        }

            }
    }

namespace Illuminate\Http {
    /**
     * 
     *
     */
    class Request {
        /**
         * 
         *
         * @see \Illuminate\Foundation\Providers\FoundationServiceProvider::registerRequestValidation()
         * @param array $rules
         * @param mixed $params
         * @static 
         */
        public static function validate($rules, ...$params)
        {
            return \Illuminate\Http\Request::validate($rules, ...$params);
        }

        /**
         * 
         *
         * @see \Illuminate\Foundation\Providers\FoundationServiceProvider::registerRequestValidation()
         * @param string $errorBag
         * @param array $rules
         * @param mixed $params
         * @static 
         */
        public static function validateWithBag($errorBag, $rules, ...$params)
        {
            return \Illuminate\Http\Request::validateWithBag($errorBag, $rules, ...$params);
        }

        /**
         * 
         *
         * @see \Illuminate\Foundation\Providers\FoundationServiceProvider::registerRequestSignatureValidation()
         * @param mixed $absolute
         * @static 
         */
        public static function hasValidSignature($absolute = true)
        {
            return \Illuminate\Http\Request::hasValidSignature($absolute);
        }

        /**
         * 
         *
         * @see \Illuminate\Foundation\Providers\FoundationServiceProvider::registerRequestSignatureValidation()
         * @static 
         */
        public static function hasValidRelativeSignature()
        {
            return \Illuminate\Http\Request::hasValidRelativeSignature();
        }

        /**
         * 
         *
         * @see \Illuminate\Foundation\Providers\FoundationServiceProvider::registerRequestSignatureValidation()
         * @param mixed $ignoreQuery
         * @param mixed $absolute
         * @static 
         */
        public static function hasValidSignatureWhileIgnoring($ignoreQuery = [], $absolute = true)
        {
            return \Illuminate\Http\Request::hasValidSignatureWhileIgnoring($ignoreQuery, $absolute);
        }

        /**
         * 
         *
         * @see \Illuminate\Foundation\Providers\FoundationServiceProvider::registerRequestSignatureValidation()
         * @param mixed $ignoreQuery
         * @static 
         */
        public static function hasValidRelativeSignatureWhileIgnoring($ignoreQuery = [])
        {
            return \Illuminate\Http\Request::hasValidRelativeSignatureWhileIgnoring($ignoreQuery);
        }

            }
    }


namespace  {
    class ApiResponse extends \App\Helpers\ApiResponse {}
    class Module extends \Nwidart\Modules\Facades\Module {}
}





