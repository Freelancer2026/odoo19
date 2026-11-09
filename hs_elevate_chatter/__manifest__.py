# -*- coding: utf-8 -*-
{
    'name': 'HS Elevate Chatter',
    'version': '19.0.0.1.2',
    'category': 'Hidden',
    'summary': 'Elevates the chatter into a collapsible drawer on the right side',
    'description': """
        This module transforms the standard Odoo form view chatter into a sliding drawer
        on the right side of the screen for desktop views. It provides a toggle button
        to open and close the chatter as needed.
    """,
    'author': 'Hesk Labs',
    'depends': ['mail', 'web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'hs_elevate_chatter/static/src/css/elevate_chatter.css',
            'hs_elevate_chatter/static/src/js/form_renderer_patch.js',
            'hs_elevate_chatter/static/src/js/form_compiler_patch.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
