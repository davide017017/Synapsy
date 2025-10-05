import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const IMAGE_EXTENSION_REGEX = /\.(?:png|jpe?g|gif|bmp|webp|svg)$/i;

export const DEFAULT_ICON: IoniconName = 'person-circle';

const AVATAR_BASE_STYLE: ImageStyle = {
    resizeMode: 'cover',
};

type AvatarMapEntry = ImageSourcePropType | (() => ImageSourcePropType);

export const AVATAR_MAP: Record<string, AvatarMapEntry> = {
    avatar_01_boy: () => require('../../../assets/images/avatars/avatar_01_boy.webp'),
    avatar_02_anziano: () => require('../../../assets/images/avatars/avatar_02_anziano.webp'),
    avatar_03_felice: () => require('../../../assets/images/avatars/avatar_03_felice.webp'),
    avatar_04_affamato: () => require('../../../assets/images/avatars/avatar_04_affamato.webp'),
    avatar_05_classico: () => require('../../../assets/images/avatars/avatar_05_classico.webp'),
    avatar_06_anziana: () => require('../../../assets/images/avatars/avatar_06_anziana.webp'),
    avatar_07_professionale: () => require('../../../assets/images/avatars/avatar_07_professionale.webp'),
    avatar_08_elegante_rossa: () => require('../../../assets/images/avatars/avatar_08_elegante_rossa.webp'),
    avatar_09_elegante_castana: () => require('../../../assets/images/avatars/avatar_09_elegante_castana.webp'),
    avatar_10_elegante_chiara: () => require('../../../assets/images/avatars/avatar_10_elegante_chiara.webp'),
    avatar_11_muscoloso: () => require('../../../assets/images/avatars/avatar_11_muscoloso.webp'),
    avatar_12_pink_beta: () => require('../../../assets/images/avatars/avatar_12_pink_beta.webp'),
    avatar_13_surfista: () => require('../../../assets/images/avatars/avatar_13_surfista.webp'),
    avatar_14_surfista_donna: () => require('../../../assets/images/avatars/avatar_14_surfista_donna.webp'),
    avatar_15_business: () => require('../../../assets/images/avatars/avatar_15_business.webp'),
};

function loadAvatar(entry: AvatarMapEntry | undefined): ImageSourcePropType | null {
    if (!entry) return null;
    return typeof entry === 'function' ? entry() : entry;
}

function stripDirectories(filename: string): string {
    return filename.replace(/\\/g, '/').split('/').pop() ?? filename;
}

export function normalizeAvatarKey(raw?: string | null): string {
    if (!raw) return '';
    const trimmed = raw.trim();
    if (!trimmed) return '';
    const base = stripDirectories(trimmed);
    const withoutExt = base.replace(/\.[^.]+$/, '');
    return withoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

export type ResolvedIconOrImage =
    | { type: 'icon'; name: IoniconName }
    | { type: 'image'; source: ImageSourcePropType };

export function resolveIconOrImage(
    value?: string | null,
    fallbackIcon: IoniconName = DEFAULT_ICON,
): ResolvedIconOrImage {
    if (!value) {
        return { type: 'icon', name: fallbackIcon };
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return { type: 'icon', name: fallbackIcon };
    }

    if (IMAGE_EXTENSION_REGEX.test(trimmed)) {
        const normalized = normalizeAvatarKey(trimmed);
        const entry = AVATAR_MAP[normalized];
        if (!entry) {
            return { type: 'icon', name: fallbackIcon };
        }
        const source = loadAvatar(entry);
        if (source) {
            return { type: 'image', source };
        }
        return { type: 'icon', name: fallbackIcon };
    }

    if (/^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
        return { type: 'image', source: { uri: trimmed } };
    }

    return { type: 'icon', name: trimmed as IoniconName };
}

export interface IconOrImageProps {
    value?: string | null;
    size?: number;
    color?: string;
    style?: StyleProp<ImageStyle | TextStyle>;
    fallbackIcon?: IoniconName;
    accessibilityLabel?: string;
    borderRadius?: number;
}

const IconOrImage: React.FC<IconOrImageProps> = ({
    value,
    size = 48,
    color = '#94a3b8',
    style,
    fallbackIcon = DEFAULT_ICON,
    accessibilityLabel,
    borderRadius,
}) => {
    const resolved = resolveIconOrImage(value, fallbackIcon);

    if (resolved.type === 'image') {
        const radius = borderRadius ?? size / 2;
        const imageStyle: StyleProp<ImageStyle> = [
            AVATAR_BASE_STYLE,
            { width: size, height: size, borderRadius: radius },
            style as StyleProp<ImageStyle>,
        ];
        return <Image source={resolved.source} style={imageStyle} accessibilityLabel={accessibilityLabel} />;
    }

    return (
        <Ionicons
            name={resolved.name}
            size={size}
            color={color}
            style={style as StyleProp<TextStyle>}
            accessibilityLabel={accessibilityLabel}
        />
    );
};

export default React.memo(IconOrImage);
