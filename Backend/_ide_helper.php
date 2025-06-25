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

namespace PHPOpenSourceSaver\JWTAuth\Facades {
    /**
     * 
     *
     */
    class JWTAuth {
        /**
         * Attempt to authenticate the user and return the token.
         *
         * @return false|string 
         * @static 
         */
        public static function attempt($credentials)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->attempt($credentials);
        }

        /**
         * Authenticate a user via a token.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject|false 
         * @static 
         */
        public static function authenticate()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->authenticate();
        }

        /**
         * Alias for authenticate().
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject|false 
         * @static 
         */
        public static function toUser()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->toUser();
        }

        /**
         * Get the authenticated user.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject 
         * @static 
         */
        public static function user()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->user();
        }

        /**
         * Generate a token for a given subject.
         *
         * @return string 
         * @static 
         */
        public static function fromSubject($subject)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->fromSubject($subject);
        }

        /**
         * Alias to generate a token for a given user.
         *
         * @return string 
         * @static 
         */
        public static function fromUser($user)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->fromUser($user);
        }

        /**
         * Refresh an expired token.
         *
         * @param bool $forceForever
         * @param bool $resetClaims
         * @return string 
         * @static 
         */
        public static function refresh($forceForever = false, $resetClaims = false)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->refresh($forceForever, $resetClaims);
        }

        /**
         * Invalidate a token (add it to the blacklist).
         *
         * @param bool $forceForever
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function invalidate($forceForever = false)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->invalidate($forceForever);
        }

        /**
         * Alias to get the payload, and as a result checks that
         * the token is valid i.e. not expired or blacklisted.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Payload 
         * @throws JWTException
         * @static 
         */
        public static function checkOrFail()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->checkOrFail();
        }

        /**
         * Check that the token is valid.
         *
         * @param bool $getPayload
         * @return \PHPOpenSourceSaver\JWTAuth\Payload|bool 
         * @static 
         */
        public static function check($getPayload = false)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->check($getPayload);
        }

        /**
         * Get the token.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Token|null 
         * @static 
         */
        public static function getToken()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->getToken();
        }

        /**
         * Parse the token from the request.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @throws JWTException
         * @static 
         */
        public static function parseToken()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->parseToken();
        }

        /**
         * Get the raw Payload instance.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Payload 
         * @static 
         */
        public static function getPayload()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->getPayload();
        }

        /**
         * Alias for getPayload().
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Payload 
         * @static 
         */
        public static function payload()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->payload();
        }

        /**
         * Convenience method to get a claim value.
         *
         * @param string $claim
         * @static 
         */
        public static function getClaim($claim)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->getClaim($claim);
        }

        /**
         * Create a Payload instance.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Payload 
         * @static 
         */
        public static function makePayload($subject)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->makePayload($subject);
        }

        /**
         * Check if the subject model matches the one saved in the token.
         *
         * @param string|object $model
         * @return bool 
         * @static 
         */
        public static function checkSubjectModel($model)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->checkSubjectModel($model);
        }

        /**
         * Set the token.
         *
         * @param \PHPOpenSourceSaver\JWTAuth\Token|string $token
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function setToken($token)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->setToken($token);
        }

        /**
         * Unset the current token.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function unsetToken()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->unsetToken();
        }

        /**
         * Set the request instance.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function setRequest($request)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->setRequest($request);
        }

        /**
         * Set whether the subject should be "locked".
         *
         * @param bool $lock
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function lockSubject($lock)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->lockSubject($lock);
        }

        /**
         * Get the Manager instance.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Manager 
         * @static 
         */
        public static function manager()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->manager();
        }

        /**
         * Get the Parser instance.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Http\Parser\Parser 
         * @static 
         */
        public static function parser()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->parser();
        }

        /**
         * Get the Payload Factory.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function factory()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->factory();
        }

        /**
         * Get the Blacklist.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Blacklist 
         * @static 
         */
        public static function blacklist()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->blacklist();
        }

        /**
         * Set the custom claims.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function customClaims($customClaims)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->customClaims($customClaims);
        }

        /**
         * Alias to set the custom claims.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\JWTAuth 
         * @static 
         */
        public static function claims($customClaims)
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->claims($customClaims);
        }

        /**
         * Get the custom claims.
         *
         * @return array 
         * @static 
         */
        public static function getCustomClaims()
        {
            //Method inherited from \PHPOpenSourceSaver\JWTAuth\JWT 
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTAuth $instance */
            return $instance->getCustomClaims();
        }

            }
    /**
     * 
     *
     */
    class JWTFactory {
        /**
         * Create the Payload instance.
         *
         * @param bool $resetClaims
         * @return \PHPOpenSourceSaver\JWTAuth\Payload 
         * @static 
         */
        public static function make($resetClaims = false)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->make($resetClaims);
        }

        /**
         * Empty the claims collection.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function emptyClaims()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->emptyClaims();
        }

        /**
         * Build and get the Claims Collection.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Claims\Collection 
         * @static 
         */
        public static function buildClaimsCollection()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->buildClaimsCollection();
        }

        /**
         * Get a Payload instance with a claims collection.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Payload 
         * @static 
         */
        public static function withClaims($claims)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->withClaims($claims);
        }

        /**
         * Set the default claims to be added to the Payload.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function setDefaultClaims($claims)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->setDefaultClaims($claims);
        }

        /**
         * Helper to set the ttl.
         *
         * @param int|null $ttl
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function setTTL($ttl)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->setTTL($ttl);
        }

        /**
         * Helper to get the ttl.
         *
         * @return int|null 
         * @static 
         */
        public static function getTTL()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->getTTL();
        }

        /**
         * Get the default claims.
         *
         * @return array 
         * @static 
         */
        public static function getDefaultClaims()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->getDefaultClaims();
        }

        /**
         * Get the PayloadValidator instance.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Validators\PayloadValidator 
         * @static 
         */
        public static function validator()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->validator();
        }

        /**
         * Set the custom claims.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function customClaims($customClaims)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->customClaims($customClaims);
        }

        /**
         * Alias to set the custom claims.
         *
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function claims($customClaims)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->claims($customClaims);
        }

        /**
         * Get the custom claims.
         *
         * @return array 
         * @static 
         */
        public static function getCustomClaims()
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->getCustomClaims();
        }

        /**
         * Set the refresh flow flag.
         *
         * @param bool $refreshFlow
         * @return \PHPOpenSourceSaver\JWTAuth\Factory 
         * @static 
         */
        public static function setRefreshFlow($refreshFlow = true)
        {
            /** @var \PHPOpenSourceSaver\JWTAuth\Factory $instance */
            return $instance->setRefreshFlow($refreshFlow);
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
    class JWTAuth extends \PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth {}
    class JWTFactory extends \PHPOpenSourceSaver\JWTAuth\Facades\JWTFactory {}
}





